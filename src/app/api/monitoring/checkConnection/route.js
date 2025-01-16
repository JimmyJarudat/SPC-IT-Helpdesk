import sql from "mssql";

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
