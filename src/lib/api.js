// src/lib/api.js

if (typeof window !== "undefined") {
    const originalFetch = window.fetch;
    let pageLoadTime = new Date();

    // เพิ่มการติดตามการเข้าถึงหน้า
    const logPageAccess = async () => {
        try {
            const userId = localStorage.getItem("userId");
            if (!userId) return;

            const currentPath = window.location.pathname;
            const logEntry = {
                url: currentPath,
                method: 'PAGE_VIEW',
                timestamp: new Date().toISOString(),
                action: getActionFromPath(currentPath)
            };

            await fetch('/api/userManagement/log/logActivity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    activity: logEntry
                })
            });
        } catch (error) {
            console.error('Error logging page access:', error);
        }
    };

    // ติดตามการเปลี่ยนหน้าโดยใช้ History API
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function() {
        originalPushState.apply(this, arguments);
        logPageAccess();
    };

    window.history.replaceState = function() {
        originalReplaceState.apply(this, arguments);
        logPageAccess();
    };

    // ติดตามการใช้ปุ่ม back/forward
    window.addEventListener('popstate', () => {
        logPageAccess();
    });

    // ติดตามการโหลดหน้าครั้งแรก
    window.addEventListener('load', () => {
        logPageAccess();
    });

    window.fetch = async (url, options) => {
        try {
            if (typeof url !== 'string' || 
                url.includes('logActivity') || 
                url.includes('_next') || 
                url.includes('nextjs') ||
                url.includes('stack-frame') ||
                url.includes('update-last-activity')) {
                return await originalFetch(url, options);
            }

            const isInternalApi = url.startsWith('/api/');
            if (!isInternalApi) {
                return await originalFetch(url, options);
            }

            const userId = localStorage.getItem("userId");
            if (!userId) return await originalFetch(url, options);

            const logEntry = {
                url,
                method: options?.method || 'GET',
                timestamp: new Date().toISOString(),
                action: getActionFromUrl(url)
            };

            const response = await originalFetch(url, options);

            await fetch('/api/userManagement/log/logActivity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    activity: logEntry
                })
            });

            return response;
        } catch (error) {
            console.error('Error in fetch wrapper:', error);
            throw error;
        }
    };
}

function getActionFromUrl(url) {
    try {
        if (typeof url !== 'string') {
            console.error('URL is not a string:', url);
            return 'ไม่สามารถระบุการกระทำ';
        }

        const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
        const path = new URL(fullUrl).pathname;
        return getActionFromPath(path);
    } catch (error) {
        console.error('Invalid URL:', url);
        return 'ไม่สามารถระบุการกระทำ';
    }
}

function getActionFromPath(path) {
    switch (true) {
        case path === '/': return 'หน้าหลัก';
        case path.includes('/dashboard'): return 'หน้าแดชบอร์ด';
        case path.includes('/profile'): return 'หน้าโปรไฟล์';
        case path.includes('/users'): return 'หน้าจัดการผู้ใช้';
        case path.includes('/products'): return 'หน้าจัดการสินค้า';
        case path.includes('/api/users'): return 'ดูข้อมูลผู้ใช้';
        case path.includes('/api/products'): return 'ดูรายการสินค้า';
        default: return `เข้าถึง ${path}`;
    }
}