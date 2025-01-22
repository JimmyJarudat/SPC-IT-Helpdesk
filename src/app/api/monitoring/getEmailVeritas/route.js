import Imap from "node-imap";
import { NextResponse } from "next/server";

export async function GET() {
  return new Promise((resolve, reject) => {
    const imap = new Imap({
      user: process.env.IMAP_USER,
      password: process.env.IMAP_PASSWORD,
      host: process.env.IMAP_HOST,
      port: parseInt(process.env.IMAP_PORT, 10),
      tls: process.env.IMAP_TLS === "true",
    });

    function openInbox(cb) {
      imap.openBox("INBOX", true, cb);
    }

    imap.once("ready", () => {
      openInbox((err) => {
        if (err) return reject(err);

        imap.search([["HEADER", "SUBJECT", "Backup Exec Alert"]], (err, results) => {
          if (err) return reject(err);
          if (!results || results.length === 0) {
            imap.end();
            resolve(NextResponse.json({ message: "No emails found." }));
            return;
          }

          const fetch = imap.fetch(results, { bodies: "HEADER.FIELDS (FROM TO SUBJECT DATE)" });
          const emails = [];

          fetch.on("message", (msg) => {
            msg.on("body", (stream) => {
              let buffer = "";
              stream.on("data", (chunk) => (buffer += chunk.toString("utf8")));
              stream.once("end", () => {
                const header = Imap.parseHeader(buffer);
                emails.push({
                  subject: header.subject[0],
                  date: new Date(header.date[0]),
                });
              });
            });
          });

          fetch.once("end", () => {
            imap.end();

            // จัดกลุ่มข้อมูลตามวัน
            const groupedByDate = emails.reduce((acc, email) => {
              const dateKey = email.date.toLocaleDateString("th-TH");
              if (!acc[dateKey]) acc[dateKey] = { timestamp: email.date.getTime(), emails: [] };
              acc[dateKey].emails.push(email);
              return acc;
            }, {});

            // สร้างสรุปผลและเรียงลำดับวันที่ (ล่าสุดก่อน)
            const summary = Object.entries(groupedByDate)
              .sort((a, b) => b[1].timestamp - a[1].timestamp) // เรียงวันที่ล่าสุดก่อน
              .map(([dateKey, { emails }]) => {
                const successes = emails.filter((email) =>
                  email.subject.includes("Job Success")
                );
                const failures = emails.filter((email) =>
                  email.subject.includes("Job Failed")
                );

                return {
                  date: dateKey, // แสดงวันที่
                  successes: successes.map((email) => ({
                    job: email.subject.match(/\(Job: "(.*)"\)/)?.[1],
                    time: email.date.toLocaleTimeString("th-TH"),
                  })),
                  failures: failures.map((email) => ({
                    job: email.subject.match(/\(Job: "(.*)"\)/)?.[1],
                    time: email.date.toLocaleTimeString("th-TH"),
                  })),
                };
              });

            resolve(NextResponse.json(summary));
          });
        });
      });
    });

    imap.once("error", (err) => {
      console.error("IMAP Connection Error:", err);
      reject(new Error(`IMAP Connection Error: ${err.message}`));
    });

    imap.connect();
  });
}
