"use client";

import { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const BackupSummaryPage = () => {
  const [summaryData, setSummaryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch("/api/monitoring/getEmailVeritas");
        const data = await response.json();

        // เรียงข้อมูลตามวันที่ (ล่าสุดก่อน)
        const sortedData = data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setSummaryData(sortedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching summary data:", error);
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        กำลังโหลดข้อมูล...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400">
          สรุปผล Backup Exec Alert
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {summaryData.map((day) => (
            <div
              key={day.date}
              className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg"
            >
              <div className="flex items-center justify-between mb-4 border-b pb-2">
                <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
                  วันที่: {day.date}
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <h3 className="font-semibold text-green-600 dark:text-green-400 mb-3 flex items-center">
                    <FaCheckCircle className="mr-2" />
                    งานที่สำเร็จ:
                  </h3>
                  {day.successes.length > 0 ? (
                    <ul className="space-y-3">
                      {day.successes.map((job, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between bg-green-50 dark:bg-green-900 p-4 rounded-md shadow-md"
                        >
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            {job.job}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {job.time}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">
                      ไม่มีงานที่สำเร็จในวันนี้
                    </p>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-red-600 dark:text-red-400 mb-3 flex items-center">
                    <FaTimesCircle className="mr-2" />
                    งานที่ล้มเหลว:
                  </h3>
                  {day.failures.length > 0 ? (
                    <ul className="space-y-3">
                      {day.failures.map((job, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between bg-red-50 dark:bg-red-900 p-4 rounded-md shadow-md"
                        >
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            {job.job}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {job.time}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">
                      ไม่มีงานที่ล้มเหลวในวันนี้
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BackupSummaryPage;
