import fs from "fs";
import path from "path";

export async function GET() {
  const baseDirectory = "X:"; 
  const targetFolders = ["SQL_Server", "mariadb" , "SQL_Server_SV70"]; 
  const excludeFromCalculation = ["CartonLog", "COMMON","PM2020_New","TRIGGERLOG","_unused","www"]; 
  const currentDate = new Date().toISOString().split("T")[0]; // วันที่ปัจจุบัน

  // ฟังก์ชันแปลงวันที่เป็น YYYY-MM-DD
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  try {
    const folderSummaries = [];
    let overallStatus = "ปกติ";

    for (const folderName of targetFolders) {
      const folderPath = path.join(baseDirectory, folderName);

      if (!fs.existsSync(folderPath) || !fs.statSync(folderPath).isDirectory()) {
        console.warn(`Folder not found or not a directory: ${folderPath}`);
        continue;
      }

      const subFolders = fs.readdirSync(folderPath).filter((item) => {
        const itemPath = path.join(folderPath, item);
        return fs.statSync(itemPath).isDirectory();
      });

      let hasTodayFilesInAllSubfolders = true;
      const fileDetails = [];

      for (const subFolder of subFolders) {
        const subFolderPath = path.join(folderPath, subFolder);
        console.log(`Scanning subfolder: ${subFolderPath}`); // Debug
        const files = fs.readdirSync(subFolderPath);

        let foundTodayFile = false;

        for (const file of files) {
          const filePath = path.join(subFolderPath, file);
          try {
            const stats = fs.statSync(filePath);

            if (stats.isFile()) {
              // แปลงวันที่เป็น YYYY-MM-DD
              const createdDate = formatDate(new Date(stats.birthtime));
              const modifiedDate = formatDate(new Date(stats.mtime));

              console.log(`Checking file: ${filePath}`);
              console.log(`Created: ${createdDate}, Modified: ${modifiedDate}`); // Debug

              if (createdDate === currentDate || modifiedDate === currentDate) {
                fileDetails.push({
                  name: file,
                  size: (stats.size / (1024 * 1024)).toFixed(2) + " MB",
                  lastModified: stats.mtime.toISOString(),
                  completedTime: stats.mtime.toLocaleTimeString(),
                  createdTime: stats.birthtime.toLocaleTimeString(),
                  subFolder,
                  excluded: excludeFromCalculation.includes(subFolder),
                });
                foundTodayFile = true;
              }
            }
          } catch (error) {
            console.error(`Error accessing file: ${filePath}`, error);
          }
        }

        if (!foundTodayFile) {
          fileDetails.push({
            name: null,
            size: null,
            lastModified: null,
            completedTime: null,
            subFolder,
            excluded: excludeFromCalculation.includes(subFolder),
            reason: excludeFromCalculation.includes(subFolder)
              ? "Excluded from calculation"
              : "No files found for today",
          });

          if (!excludeFromCalculation.includes(subFolder)) {
            hasTodayFilesInAllSubfolders = false;
          }
        }
      }

      folderSummaries.push({
        folderName,
        status: hasTodayFilesInAllSubfolders ? "ปกติ" : "ล้มเหลว",
        fileDetails,
      });

      if (!hasTodayFilesInAllSubfolders) {
        overallStatus = "ล้มเหลว";
      }
    }

    return new Response(
      JSON.stringify({
        overallStatus,
        folderSummaries,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error reading directories:", error);
    return new Response(
      JSON.stringify({ error: "Error reading directories" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
