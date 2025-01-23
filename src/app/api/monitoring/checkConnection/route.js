import sql from "mssql";

/**
 * @swagger
 * /api/monitorring/checkConnection:
 *   post:
 *     summary: ตรวจสอบสถานะเซิร์ฟเวอร์ SQL
 *     description: เชื่อมต่อกับเซิร์ฟเวอร์ SQL ที่ระบุใน environment variables และตรวจสอบสถานะการเชื่อมต่อ
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: การเชื่อมต่อสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: สถานะของการดำเนินงาน
 *                 results:
 *                   type: array
 *                   description: รายการผลลัพธ์การตรวจสอบเซิร์ฟเวอร์
 *                   items:
 *                     type: object
 *                     properties:
 *                       server:
 *                         type: string
 *                         description: ชื่อเซิร์ฟเวอร์ที่ตรวจสอบ
 *                       status:
 *                         type: string
 *                         description: สถานะของเซิร์ฟเวอร์
 *                       error:
 *                         type: string
 *                         description: ข้อผิดพลาด (ถ้ามี)
 *       500:
 *         description: มีข้อผิดพลาดที่ไม่คาดคิด
 */


export async function POST(request) {
    try {
        // ดึงข้อมูลเซิร์ฟเวอร์จาก .env
        const servers = process.env.SQL_SERVERS.split(",");
        const users = process.env.SQL_USERS.split(",");
        const passwords = process.env.SQL_PASSWORDS.split(",").map(pwd => 
            decodeURIComponent(pwd)
        );

        const results = [];

        for (let i = 0; i < servers.length; i++) {
            if (!users[i] || !passwords[i] || !servers[i]) {
                console.error(`Missing configuration for server index ${i}`);
                results.push({
                    server: servers[i] || "Unknown",
                    status: "ล้มเหลว",
                    error: "Missing user, password, or server configuration.",
                });
                continue;
            }

            const config = {
                user: users[i],
                password: passwords[i],
                server: servers[i],
                options: {
                    encrypt: true, // ใช้การเข้ารหัส
                    trustServerCertificate: true, // ป้องกันปัญหาใบรับรองในระบบ Local
                },
            };
            console.log(`Connecting to server: ${servers[i]} with user: ${users[i]} and password: ${passwords[i]}`);
            console.log("SQL Passwords:", process.env.SQL_PASSWORDS.split(","));


            try {
                console.log(`Checking connection to server: ${servers[i]} with user: ${users[i]}`);
                const pool = await sql.connect(config);

                results.push({
                    server: servers[i],
                    status: "ออนไลน์ปกติ",
                });

                await pool.close();
            } catch (error) {
                console.error(`Connection failed for server: ${servers[i]}`, error.message);
                results.push({
                    server: servers[i],
                    status: "ล้มเหลว",
                    error: error.message,
                });
            }
        }

        return new Response(JSON.stringify({ success: true, results }), { status: 200 });
    } catch (error) {
        console.error("Unexpected error in route:", error.message);
        return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
    }
}
