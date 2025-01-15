import puppeteer from 'puppeteer';

export async function POST(request) {
    try {
        const { websites, credentials } = await request.json();

        // Mapping สำหรับ username และ password ของแต่ละเว็บไซต์
        const defaultCredentials = {
            'IT Profile': {
                username: process.env.IT_PROFILE_USERNAME,
                password: process.env.IT_PROFILE_PASSWORD,
            },
            'Carton Web System (User)': {
                username: process.env.CARTON_USER_USERNAME,
                password: process.env.CARTON_USER_PASSWORD,
            },
            'Carton Web System (Admin)': {
                username: process.env.CARTON_ADMIN_USERNAME,
                password: process.env.CARTON_ADMIN_PASSWORD,
            },
            'Pro-File Center (User)': {
                username: process.env.PRO_FILE_CENTER_USERNAME,
                password: process.env.PRO_FILE_CENTER_PASSWORD,
            },
            'Pro-File Center (Admin)': {
                username: process.env.PRO_FILE_CENTER_ADMIN_USERNAME,
                password: process.env.PRO_FILE_CENTER_ADMIN_PASSWORD,
            },
            'Finance System': {
                username: process.env.FINANCE_SYSTEM_USERNAME,
                password: process.env.FINANCE_SYSTEM_PASSWORD,
            },
            'HR System': {
                username: process.env.HR_SYSTEM_USERNAME,
                password: process.env.HR_SYSTEM_PASSWORD,
            },
        };

        const results = [];
        for (let i = 0; i < websites.length; i++) {
            const { name: websiteName, url, usernameSelector, passwordSelector, buttonSelector, userInfoSelector } = websites[i];

            // ใช้ credentials ที่ผู้ใช้กรอกหากมี หากไม่มีจึงใช้ค่าจาก .env
            const customCred = credentials?.[websiteName];
            const finalUsername = customCred?.username || defaultCredentials[websiteName]?.username || process.env.DEFAULT_USERNAME;
            const finalPassword = customCred?.password || defaultCredentials[websiteName]?.password || process.env.DEFAULT_PASSWORD;

            let websiteStatus = 'ไม่สามารถเข้าถึงเว็บไซต์';
            let afterLoginUrl = '';
            let loginStatus = 'ล็อกอินล้มเหลว';
            let userInfo = 'ไม่สามารถดึงข้อมูลผู้ใช้ได้';

            try {
                const websiteResponse = await fetch(url, { method: 'GET' });
                if (websiteResponse.ok) {
                    websiteStatus = 'ออนไลน์ปกติ';
                }
            } catch (error) {
                console.error(`Website Status Error for ${websiteName}:`, error.message);
            }

            try {
                const browser = await puppeteer.launch({
                    headless: true,
                    args: ['--disable-gpu', '--no-sandbox', '--disable-setuid-sandbox'],
                });
                const page = await browser.newPage();

                await page.setUserAgent(
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                );

                await page.goto(url, {
                    timeout: 60000,
                    waitUntil: 'networkidle2',
                });

                // กรอก Username และ Password
                await page.type(usernameSelector, finalUsername);
                await page.type(passwordSelector, finalPassword);
                console.log("่ดูนี่นะใครล็อคอิน",finalUsername)
                // กดปุ่ม Login
                await page.click(buttonSelector);

                // รอจนหน้าเว็บเปลี่ยน
                await page.waitForNavigation({ timeout: 60000, waitUntil: 'networkidle2' });
                afterLoginUrl = page.url();

                // ดึงข้อมูลผู้ใช้
                const userElement = await page.$(userInfoSelector);
                userInfo = userElement ? await page.evaluate(el => el.textContent.trim(), userElement) : 'ไม่พบข้อมูลผู้ใช้';

                loginStatus = 'ล็อกอินสำเร็จ'; // หากถึงจุดนี้ถือว่าล็อกอินสำเร็จ

                await browser.close();
            } catch (error) {
                console.error(`Login Error for ${websiteName}:`, error.message);
                loginStatus = 'ล็อกอินล้มเหลว'; // หากเกิดข้อผิดพลาด
            }

            results.push({
                websiteName,
                websiteStatus,
                loginStatus,
                userInfo,
                beforeLoginUrl: url,
                afterLoginUrl,
            });
        }

        return new Response(JSON.stringify({ success: true, results }), { status: 200 });
    } catch (error) {
        console.error('API Error:', error.message);
        return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
    }
}