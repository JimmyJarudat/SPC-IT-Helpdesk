import { NextResponse } from "next/server";
import { Client } from "ssh2";

export async function GET() {
  return new Promise((resolve, reject) => {
    const conn = new Client();

    conn.on("ready", () => {
      console.log("✅ SSH Connection Ready");

      // แยกคำสั่งออกมาให้ชัดเจน
      const dfCommand = 'df -h /share/CACHEDEV1_DATA';
      
      // ทดสอบรันแค่คำสั่ง df อย่างเดียวก่อน
      conn.exec(dfCommand, (err, stream) => {
        if (err) {
          console.error("SSH Exec Error:", err);
          conn.end();
          return reject(NextResponse.json({ error: err.message }));
        }

        let output = '';
        let errorOutput = '';

        // จัดการ stdout
        stream.on('data', (data) => {
          console.log('Output:', data.toString());
          output += data;
        });

        // จัดการ stderr
        stream.stderr.on('data', (data) => {
          console.log('Error Output:', data.toString());
          errorOutput += data;
        });

        // จัดการเมื่อ stream จบ
        stream.on('close', (code) => {
          console.log('Command Exit Code:', code);
          console.log('Final Output:', output);
          console.log('Error Output:', errorOutput);

          conn.end();

          // ส่งข้อมูลกลับเพื่อดูผล
          resolve(NextResponse.json({
            success: true,
            output: output.toString(),
            error: errorOutput.toString(),
            exitCode: code
          }));
        });
      });
    });

    // จัดการ error ของ connection
    conn.on('error', (err) => {
      console.error('Connection Error:', err);
      reject(NextResponse.json({ error: err.message }));
    });

    // เพิ่ม debug mode
    conn.connect({
      host: "192.168.2.83",
      port: 8778,
      username: "spaprofile",
      password: "Pf@740#5020",
      debug: (msg) => console.log('SSH Debug:', msg)
    });
  });
}