import { Client } from "ssh2";

export async function GET() {
  const sshConfig = {
    host: "192.168.2.83",
    port: 8778,
    username: "spaprofile",
    password: "Pf@740#5020",
  };

  const baseDirectory = "/share/CACHEDEV1_DATA/Backup2025";
  const targetFolders = ["SQL_Server", "mariadb", "SQL_Server_SV70"];
  const excludeFromCalculation = ["CartonLog", "COMMON", "PM2020_New", "TRIGGERLOG", "_unused", "www"];

  console.log("🔹 กำลังเชื่อมต่อ SSH ไปยัง NAS...");

  return new Promise((resolve, reject) => {
    const conn = new Client();

    conn.on("ready", () => {
      console.log("✅ เชื่อมต่อ SSH สำเร็จ!");

      let overallStatus = "ปกติ";
      let folderSummaries = [];
      let completedRequests = 0;

      // รับวันที่ปัจจุบันในรูปแบบ YYYY-MM-DD
      const currentDate = new Date().toISOString().split("T")[0];

      for (const folderName of targetFolders) {
        const folderPath = `${baseDirectory}/${folderName}`;
        console.log(`📂 ตรวจสอบโฟลเดอร์หลัก: ${folderPath}`);

        // ใช้คำสั่ง ls -la --time-style=full-iso เพื่อให้ได้เวลาที่ละเอียดขึ้น
        const listFilesCmd = `find ${folderPath} -type f -printf "%h\\n%f\\n%s\\n%TY-%Tm-%Td\\n%TH:%TM:%TS\\n%CH:%CM:%CS\\n"`;

        conn.exec(listFilesCmd, (err, stream) => {
          if (err) {
            console.error(`❌ Error executing command: ${listFilesCmd}`, err);
            completedRequests++;
            return;
          }

          let output = "";
          stream.on("data", (data) => {
            output += data.toString();
          });

          stream.on("close", () => {
            const lines = output.trim().split("\n");
            const fileDetails = [];
            const processedSubFolders = new Set();

            // Process 6 lines at a time (path, name, size, date, mtime, ctime)
            for (let i = 0; i < lines.length; i += 6) {
              const fullPath = lines[i];
              const fileName = lines[i + 1];
              const fileSize = parseInt(lines[i + 2]);
              const modifiedDate = lines[i + 3];
              const modifiedTime = lines[i + 4];
              const createdTime = lines[i + 5];

              // Extract subFolder name from fullPath
              const subFolder = fullPath.split("/").pop();
              processedSubFolders.add(subFolder);

              if (modifiedDate === currentDate) {
                fileDetails.push({
                  name: fileName,
                  size: (fileSize / (1024 * 1024)).toFixed(2) + " MB",
                  lastModified: `${modifiedDate}T${modifiedTime}`,
                  completedTime: modifiedTime,
                  createdTime: createdTime,
                  subFolder,
                  excluded: excludeFromCalculation.includes(subFolder)
                });
              }
            }

            // Add entries for subfolders with no files today
            conn.exec(`ls -d ${folderPath}/*/ | xargs -n 1 basename`, (err, stream) => {
              if (err) {
                console.error("Error getting subdirectories:", err);
                return;
              }

              let subFolderOutput = "";
              stream.on("data", (data) => {
                subFolderOutput += data.toString();
              });

              stream.on("close", () => {
                const allSubFolders = subFolderOutput.trim().split("\n");
                
                for (const subFolder of allSubFolders) {
                  if (!processedSubFolders.has(subFolder)) {
                    fileDetails.push({
                      name: null,
                      size: null,
                      lastModified: null,
                      completedTime: null,
                      subFolder,
                      excluded: excludeFromCalculation.includes(subFolder),
                      reason: excludeFromCalculation.includes(subFolder)
                        ? "Excluded from calculation"
                        : "No files found for today"
                    });
                  }
                }

                // Check if all non-excluded subfolders have files
                const hasTodayFilesInAllSubfolders = allSubFolders
                  .filter(folder => !excludeFromCalculation.includes(folder))
                  .every(folder => 
                    fileDetails.some(file => 
                      file.subFolder === folder && file.name !== null
                    )
                  );

                folderSummaries.push({
                  folderName,
                  status: hasTodayFilesInAllSubfolders ? "ปกติ" : "ล้มเหลว",
                  fileDetails
                });

                if (!hasTodayFilesInAllSubfolders) {
                  overallStatus = "ล้มเหลว";
                }

                completedRequests++;

                if (completedRequests === targetFolders.length) {
                  console.log("🟢 ส่ง JSON Response กลับไปยัง Client...");
                  conn.end();
                  resolve(new Response(
                    JSON.stringify({
                      overallStatus,
                      folderSummaries
                    }),
                    { status: 200, headers: { "Content-Type": "application/json" } }
                  ));
                }
              });
            });
          });
        });
      }
    });

    conn.on("error", (err) => {
      console.error("❌ SSH Connection Error:", err);
      reject(new Response(
        JSON.stringify({ error: "SSH Connection Failed", details: err.message }), 
        { status: 500, headers: { "Content-Type": "application/json" } }
      ));
    });

    conn.connect(sshConfig);
  });
}