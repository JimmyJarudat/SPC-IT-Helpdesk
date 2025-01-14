import fs from "fs";
import path from "path";

export async function GET() {
  const baseDirectory = "D:/Backup2025"; 
  const targetFolders = ["SQL_Server", "MR_DB"]; 
  const excludeFromCalculation = ["Test2","New folder (2)"]; 
  const currentDate = new Date().toISOString().split("T")[0];

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
        const files = fs.readdirSync(subFolderPath);
        let foundTodayFile = false;

        for (const file of files) {
          const filePath = path.join(subFolderPath, file);
          const stats = fs.statSync(filePath);
          
          if (stats.isFile()) {
            const modifiedDate = new Date(stats.mtime).toISOString().split("T")[0];
            if (modifiedDate === currentDate) {
              fileDetails.push({
                name: file,
                size: (stats.size / (1024 * 1024)).toFixed(2) + " MB",
                lastModified: stats.mtime.toISOString(),
                completedTime: stats.mtime.toLocaleTimeString(),
                subFolder,
                excluded: excludeFromCalculation.includes(subFolder),
              });
              foundTodayFile = true;
            }
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