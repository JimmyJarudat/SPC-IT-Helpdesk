// src/lib/api.js
import { toast } from 'sonner';

if (typeof window !== "undefined") {
    const originalFetch = window.fetch;
    let pageLoadTime = new Date();
    let isConsoleOpen = false;
    let devToolsCounter = 0;
    let lastPageChangeTime = new Date(); // เพิ่มตัวแปรใหม่
    let lastDevToolsHeight = window.outerHeight - window.innerHeight;

    const SecurityWarningSystem = {
        warningLevels: {
            CRITICAL: 'CRITICAL',
            HIGH: 'HIGH',
            MEDIUM: 'MEDIUM',
        },

        warningCounts: {
            debugger: 0,
            sourceCode: 0,
            console: 0,
        },

        messages: {
            debugger: {
                title: '⚠️ การกระทำที่ไม่ได้รับอนุญาต',
                message: 'ตรวจพบการใช้ Debugger - การกระทำนี้ถูกบันทึกไว้',
                level: 'CRITICAL',
            },
            sourceCode: {
                title: '⚠️ คำเตือนความปลอดภัย',
                message: 'ตรวจพบความพยายามในการดู Source Code - การกระทำนี้ถูกบันทึกไว้',
                level: 'HIGH',
            },
            console: {
                title: '⚠️ คำเตือน',
                message: 'ตรวจพบการใช้ Console - การกระทำนี้ถูกบันทึกไว้',
                level: 'HIGH',
            },
            networktab: {
                title: '⚠️ การกระทำที่ไม่ได้รับอนุญาต',
                message: 'ตรวจพบการใช้ networktab - การกระทำนี้ถูกบันทึกไว้',
                level: 'MEDIUM',
            },
        },

        showWarning(type) {
            // ตรวจสอบว่าเป็นกรณีของ 'debugger' เท่านั้น
            
            this.warningCounts[type]++;
            const warning = this.messages[type];

            // แสดงข้อความแจ้งเตือนแบบ toast
            toast.error(warning.message, {
                duration: 5000,
                position: 'top-right',
                style: this.getWarningStyle(warning.level),
            });

            // แสดง Modal หากเป็น CRITICAL หรือแจ้งเตือนเกิน 3 ครั้ง
            if (warning.level === 'CRITICAL' || this.warningCounts[type] >= 3) {
                if (window.showConsoleWarning) {
                    window.showConsoleWarning({
                        title: warning.title,
                        message: `${warning.message}\n\nการกระทำนี้ได้ถูกบันทึกพร้อม IP Address และข้อมูลเบราว์เซอร์ของคุณ\n\nหากดำเนินการต่อ บัญชีของคุณอาจถูกระงับการใช้งาน`,
                        level: warning.level,
                    });
                }
            }

            // บันทึกกิจกรรม
            this.logWarning(type, warning.level);
        },

        async logWarning(type, level) {
            try {
                const userId = localStorage.getItem("userId");
                if (!userId) return;

                const ipAddress = await getIpAddress();
                const warningLog = {
                    type,
                    level,
                    count: this.warningCounts[type],
                    userAgent: navigator.userAgent,
                    timestamp: new Date().toISOString(),
                    url: window.location.href,
                    ipAddress,
                };

                await fetch('/api/userManagement/log/logActivity', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId,
                        activity: warningLog,
                        logType: 'SECURITY_WARNING',
                    }),
                });

                // แจ้งเตือนผู้ดูแลระบบถ้าเป็น CRITICAL
                if (level === 'CRITICAL') {
                    await this.notifyAdmin(warningLog);
                }
            } catch (error) {
                console.error('Error logging warning:', error);
            }
        },

        async notifyAdmin(warningLog) {
            try {
                await fetch('/api/admin/security-alert', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(warningLog),
                });
            } catch (error) {
                console.error('Error notifying admin:', error);
            }
        },

        getWarningStyle(level) {
            switch (level) {
                case 'CRITICAL':
                    return { background: '#dc2626', color: 'white', border: '2px solid #991b1b', fontWeight: 'bold' };
                case 'HIGH':
                    return { background: '#ea580c', color: 'white', border: '2px solid #9a3412' };
                default:
                    return { background: '#f59e0b', color: 'white', border: '2px solid #b45309' };
            }
        },
    };


    const getIpAddress = async () => {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            // ใช้ originalConsoleMethods แทน console โดยตรง
            originalConsoleMethods.error?.('Error getting IP address:', error);
            return null;
        }
    };


    let suspiciousActions = {
        console: 0,
        debugger: 0,
        sourceView: 0,
        network: 0,
        print: 0,
        drag: 0,
        copy: 0,
        performance: 0
    };

    

    // เพิ่มฟังก์ชัน resetPageState
    const resetPageState = () => {
        lastPageChangeTime = new Date();
        pageLoadTime = new Date();
        isConsoleOpen = false;
        suspiciousActions = {
            console: 0,
            debugger: 0,
            sourceView: 0
        };
    };

    const logSOSActivity = async (type, action, details = '') => {
        try {
            const userId = localStorage.getItem("userId");
            if (!userId) return;
            const ipAddress = await getIpAddress();

            const logEntry = {
                type,
                action,
                details,
                userAgent: navigator.userAgent,
                timestamp: new Date().toISOString(),
                url: window.location.href,
                ipAddress // Add IP address to log entry
            };

           

            await fetch('/api/userManagement/log/logActivity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    activity: logEntry,
                    logType: 'SOS'
                })
            });
        } catch (error) {
            console.error('Error logging SOS activity:', error);
        }
    };

    // ตรวจจับการเปิด Console ด้วยคีย์ลัด
    window.addEventListener('keydown', (e) => {
        // Command + Option + I (Mac) หรือ Control + Shift + I (Windows)
        if ((e.metaKey && e.altKey && e.key === 'i') ||
            (e.ctrlKey && e.shiftKey && e.key === 'i')) {
            logSOSActivity('console', 'Console Shortcut Used', 'Attempted to open console with keyboard shortcut');
        }

        // Command + Option + J (Mac) หรือ Control + Shift + J (Windows)
        if ((e.metaKey && e.altKey && e.key === 'j') ||
            (e.ctrlKey && e.shiftKey && e.key === 'j')) {
            logSOSActivity('console', 'Console Shortcut Used', 'Attempted to open console with keyboard shortcut');
        }

        // F12
        if (e.key === 'F12') {
            logSOSActivity('console', 'F12 Key Pressed', 'Attempted to open developer tools with F12');
            SecurityWarningSystem.showWarning('debugger');
        }
    });

    // ตรวจจับการเปิด networktabนะจ๊ะ
    const detectNetworkTab = () => {
        const currentDevToolsHeight = window.outerHeight - window.innerHeight;
        if (Math.abs(currentDevToolsHeight - lastDevToolsHeight) > 50) {
            logSOSActivity('network', 'Network Tab', 'Potential network tab activity detected');
            SecurityWarningSystem.showWarning('networktab');
        }
        lastDevToolsHeight = currentDevToolsHeight;
    };

    setInterval(detectNetworkTab, 2000);

    // ตรวจจับการเปิด Console ด้วยวิธีขนาดหน้าจอ
    const detectDevTools = () => {
        const threshold = 300;
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;



        // ตรวจสอบเวลาที่ผ่านไปจากการเปลี่ยนหน้าล่าสุด
        const timeSincePageChange = new Date() - lastPageChangeTime;
        // ถ้าเพิ่งมีการเปลี่ยนหน้าไม่เกิน 2 วินาที ให้ข้ามการตรวจสอบ
        if (timeSincePageChange < 2000) {
            return;
        }

        if (!isConsoleOpen && (widthThreshold || heightThreshold)) {
            isConsoleOpen = true;
            logSOSActivity('console', 'DevTools Opened', 'Detected via window size change');
            devToolsCounter++;
        } else if (isConsoleOpen && !widthThreshold && !heightThreshold) {
            isConsoleOpen = false;
        }
    };

    setInterval(detectDevTools, 2000);

    // ตรวจจับการใช้ debugger
    const detectDebugger = () => {
        const startTime = new Date().getTime();
        debugger;
        const endTime = new Date().getTime();
        if (endTime - startTime > 100) {
            logSOSActivity('debugger', 'Debugger Detected', 'Debugger statement was paused');
        }
    };

    setInterval(detectDebugger, 2000);

    //ตรวจจับการลาก Elements
    document.addEventListener('dragstart', (e) => {
        logSOSActivity('drag', 'Element Drag', 'Attempted to drag page elements');
        e.preventDefault();
    });

    //การตรวจจับ Print/Save Page
    document.addEventListener('keydown', (e) => {
        // Detect Print Screen
        if (e.key === 'PrintScreen') {
            logSOSActivity('print', 'Print Screen', 'Screenshot attempted');
        }

        // Detect Ctrl+P (Print)
        if (e.ctrlKey && e.key === 'p') {
            e.preventDefault();
            logSOSActivity('print', 'Print Page', 'Print page attempted');
        }
    });

    // Disable source map request
    const originalCreateElement = document.createElement.bind(document);
    document.createElement = function (tagName) {
        const element = originalCreateElement(tagName);
        if (tagName.toLowerCase() === 'script') {
            element.addEventListener('error', (e) => {
                if (e.target.src && e.target.src.endsWith('.map')) {
                    logSOSActivity('sourcemap', 'Source Map Request', 'Attempted to load source map');
                    e.preventDefault();
                }
            });
        }
        return element;
    };
    //การตรวจจับ Copy/Paste
    document.addEventListener('copy', (e) => {
        logSOSActivity('copy', 'Copy Content', 'Content copy attempted');
    });
    //การตรวจจับ Copy/Paste

    document.addEventListener('paste', (e) => {
        logSOSActivity('paste', 'Paste Content', 'Content paste attempted');
    });

    const detectPerformanceTools = () => {
        const timing = performance.timing;
        if (timing && timing.loadEventEnd - timing.navigationStart > 10000) {
            logSOSActivity('performance', 'Performance Tools', 'Unusual page load timing detected');
        }
    };


    // Override console methods
    const originalConsoleMethods = {
        warn: console.warn,
        info: console.info,
        debug: console.debug,
        //log: console.log,  // เพิ่ม log
        //error: console.error  // เพิ่ม error
    };

    Object.keys(originalConsoleMethods).forEach(method => {
        console[method] = function (...args) {
            // เช็คว่าเป็นการ refresh หรือไม่
            const isRefresh = performance?.navigation?.type === 1;
            // เช็คเวลาที่ผ่านไปจากการโหลดหน้า
            const timeSincePageLoad = new Date() - pageLoadTime;

            // แสดง warning เฉพาะเมื่อไม่ใช่การ refresh และผ่านไป 2 วินาที
            if (!isRefresh && timeSincePageLoad > 2000) {
                if (window.showConsoleWarning) {
                    window.showConsoleWarning({
                        title: '⚠️ คำเตือนความปลอดภัย',
                        message: 'ตรวจพบการใช้ Debugger\nการกระทำนี้ถูกบันทึกไว้',
                        level: 'CRITICAL'
                    });
                }
                logSOSActivity('console', `Console ${method} Used`, args.join(', ').substring(0, 100));
            }

            // ยังคงเรียก original method ตามปกติ
            originalConsoleMethods[method].apply(console, args);
        };
    });

    // ตรวจจับการดู Source Code
    document.addEventListener('contextmenu', (e) => {
        // แค่บันทึกกิจกรรมโดยไม่แจ้งเตือน
        const userId = localStorage.getItem("userId");
        if (userId) {
            fetch('/api/userManagement/log/logActivity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    activity: {
                        type: 'source-code',
                        action: 'Right Click',
                        details: 'Context menu opened',
                        timestamp: new Date().toISOString(),
                        url: window.location.href
                    },
                    logType: 'SOS'
                })
            });
        }
    });

    // Disable various keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Prevent view source: Ctrl+U
        if (e.ctrlKey && e.key === 'u') {
            e.preventDefault();
            logSOSActivity('source-code', 'View Source Attempted', 'Ctrl+U pressed');
        }
        // Prevent save page: Ctrl+S
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            logSOSActivity('source-code', 'Save Page Attempted', 'Ctrl+S pressed');
        }
    });


    // แก้ไขฟังก์ชัน logPageAccess
    const logPageAccess = async () => {
        try {
            const userId = localStorage.getItem("userId");
            if (!userId) return;
            const ipAddress = await getIpAddress();

            const currentPath = window.location.pathname;
            const logEntry = {
                url: currentPath,
                method: 'PAGE_VIEW',
                timestamp: new Date().toISOString(),
                action: getActionFromPath(currentPath),
                ipAddress // Add IP address to log entry
            };

            await fetch('/api/userManagement/log/logActivity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    activity: logEntry,
                    logType: 'PAGE_VIEW'  // เพิ่ม logType เพื่อให้ route handler รู้ว่าต้องบันทึกลงใน activityLogPage
                })
            });
        } catch (error) {
            originalConsoleMethods.error?.('Error logging SOS activity:', error);
        }
    };

    // ติดตามการเปลี่ยนหน้าโดยใช้ History API
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function () {
        resetPageState();
        originalPushState.apply(this, arguments);
        logPageAccess();
    };

    window.history.replaceState = function () {
        resetPageState();
        originalReplaceState.apply(this, arguments);
        logPageAccess();
    };

    // ติดตามการใช้ปุ่ม back/forward
    window.addEventListener('popstate', () => {
        resetPageState();
        logPageAccess();
    });

    // ติดตามการโหลดหน้าครั้งแรก
    window.addEventListener('load', () => {
        resetPageState();
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

            const ipAddress = await getIpAddress();

            const logEntry = {
                url,
                method: options?.method || 'GET',
                timestamp: new Date().toISOString(),
                action: getActionFromUrl(url),
                ipAddress // Add IP address to log entry
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
            originalConsoleMethods.error?.('Error logging page access:', error);
            throw error;
        }
    };
}

function getActionFromUrl(url) {
    try {
        if (typeof url !== 'string') {
            originalConsoleMethods.error?.('URL is not a string:', url);
            return 'ไม่สามารถระบุการกระทำ';
        }

        const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
        const path = new URL(fullUrl).pathname;
        return getActionFromPath(path);
    } catch (error) {
        originalConsoleMethods.error?.('Invalid URL:', url);
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