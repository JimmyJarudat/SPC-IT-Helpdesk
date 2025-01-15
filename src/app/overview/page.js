'use client'

import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useLoading } from "@/contexts/LoadingContext";


export default function Backups() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState({});
  const { loading, showLoading, hideLoading } = useLoading();



  function formatDateTime(dateString) {
    if (!dateString || isNaN(new Date(dateString))) return "-";
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };
    const formattedDate = new Intl.DateTimeFormat("th-TH", options).format(
      new Date(dateString)
    );
    return formattedDate.replace(",", " น.");
  }

  useEffect(() => {
    const fetchStatus = async () => {
      showLoading();
      try {
        const response = await fetch('/api/backup/getBackups', {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);

      } catch (error) {
        console.error("Error fetching status:", error);
        setError(error.message);
      } finally{
        hideLoading();
      }
    };
    fetchStatus();
  }, []);

  const toggleFolder = (subFolder) => {
    setExpandedFolders(prev => ({
      ...prev,
      [subFolder]: !prev[subFolder]
    }));
  };

  const renderGroupedFiles = (fileDetails) => {
    const groupedFiles = fileDetails.reduce((acc, file) => {
      const key = file.subFolder;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(file);
      return acc;
    }, {});

    return Object.entries(groupedFiles).map(([subFolder, files]) => {
      const isExpanded = expandedFolders[subFolder];
      const displayFiles = isExpanded ? files : [files[0]];

      return (
        <React.Fragment key={subFolder}>
          <tr className={`bg-gray-50 dark:bg-gray-800 ${!displayFiles[0].name && displayFiles[0].excluded === false ? "bg-red-100 dark:bg-red-800" : ""}`}>
            <td className="px-4 py-2 border-b font-medium">
              {subFolder || "-"}
            </td>
            <td className="px-4 py-2 border-b">
              {displayFiles[0].name || "No backup files for today"}
            </td>
            <td className="px-4 py-2 border-b">{displayFiles[0].size || "-"}</td>
            <td className="px-4 py-2 border-b">
              {formatDateTime(displayFiles[0].lastModified)}
            </td>
            <td className="px-4 py-2 border-b">
              {displayFiles[0].excluded ? "Yes" : "No"}
            </td>
            <td className="px-4 py-2 border-b text-center">
              <div className="flex items-center justify-start space-x-2">
                <span>{files.length}</span>
                {files.length > 1 && (
                  <button
                    onClick={() => toggleFolder(subFolder)}
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            </td>
          </tr>

          {/* แสดงไฟล์เมื่อคลิกขยาย */}
          {isExpanded && files.slice(1).map((file, index) => (
            <tr
              key={`${subFolder}-${index + 1}`}
              className={`bg-gray-100 dark:bg-gray-700 ${!file.name && file.excluded === false ? "bg-red-100 dark:bg-red-800" : ""}`}
            >
              <td className="px-4 py-2 border-b pl-8"></td>
              <td className="px-4 py-2 border-b">{file.name || "No backup files for today"}</td>
              <td className="px-4 py-2 border-b">{file.size || "-"}</td>
              <td className="px-4 py-2 border-b">{formatDateTime(file.lastModified)}</td>
              <td className="px-4 py-2 border-b">{file.excluded ? "Yes" : "No"}</td>
              <td className="px-4 py-2 border-b"></td>
            </tr>
          ))}
        </React.Fragment>


      );
    });
  };

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">
        Backup Folder Status
      </h1>
      {error ? (
        <p className="text-red-500 text-lg">Error: {error}</p>
      ) : (
        data && (
          <>
            <div className="mb-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                Overall Status:{" "}
                <span
                  className={`px-3 py-1 rounded-lg font-bold ${data.overallStatus === "ปกติ"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                    }`}
                >
                  {data.overallStatus}
                </span>
              </h2>
            </div>



            <div className="mb-8">
              <table className="w-full text-left border-collapse bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 border-b text-gray-800 dark:text-gray-200">
                      Folder Name
                    </th>
                    <th className="px-4 py-3 border-b text-gray-800 dark:text-gray-200">
                      Status
                    </th>
                    <th className="px-4 py-3 border-b text-gray-800 dark:text-gray-200">
                      Folders with No Files
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.folderSummaries.map((folder, index) => (
                    <tr
                      key={index}
                      className={`odd:bg-gray-50 even:bg-gray-100 dark:odd:bg-gray-800 dark:even:bg-gray-700 ${folder.status === "ล้มเหลว" ? "bg-red-50 dark:bg-red-900" : ""}`}
                    >
                      <td className="px-4 py-3 border-b">{folder.folderName}</td>
                      <td
                        className={`px-4 py-3 border-b font-bold ${folder.status === "ปกติ" ? "text-green-500" : "text-red-500"}`}
                      >
                        {folder.status}
                      </td>
                      <td className="px-4 py-3 border-b">
                        {folder.fileDetails
                          .filter((file) => !file.name && file.excluded === false)  // ตรวจสอบไฟล์ที่ไม่มีชื่อและไม่ได้ถูกยกเว้น
                          .map((file) => file.subFolder)
                          .join(", ") || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>


            {data.folderSummaries.map((folder, index) => (
              <div
                key={index}
                className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md"
              >
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                  {folder.folderName}{" "}
                  <span
                    className={`text-sm px-2 py-1 rounded-full font-bold ${folder.status === "ปกติ"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                      }`}
                  >
                    {folder.status}
                  </span>
                </h2>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-2 border-b text-gray-800 dark:text-gray-200">
                          Subfolder
                        </th>
                        <th className="px-4 py-2 border-b text-gray-800 dark:text-gray-200">
                          File Name
                        </th>
                        <th className="px-4 py-2 border-b text-gray-800 dark:text-gray-200">
                          Size
                        </th>
                        <th className="px-4 py-2 border-b text-gray-800 dark:text-gray-200">
                          Last Modified Date
                        </th>
                        <th className="px-4 py-2 border-b text-gray-800 dark:text-gray-200">
                          Excluded
                        </th>
                        <th className="px-4 py-2 border-b text-gray-800 dark:text-gray-200">
                          Files Count
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {renderGroupedFiles(folder.fileDetails)}
                    </tbody>
                  </table>

                  <div className="mt-4 p-4 text-sm text-gray-600 dark:text-gray-400 italic">
                    {folder.folderName === 'MR_DB'
                      ? 'ในการคำนวณสถานะ ไม่รวมโฟลเดอร์ที่ไม่มีไฟล์'
                      : 'โฟลเดอร์ที่ไม่มีไฟล์จะไม่ได้รับการคำนวณ Test2'
                    }
                  </div>
                </div>
              </div>
            ))}

          </>
        )
      )}
    </div>
  );
}