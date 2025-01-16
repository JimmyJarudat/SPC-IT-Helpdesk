'use client';
import { useState, useEffect } from "react";

const SQLStatusPage = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSQLStatus = async () => {
        try {
            const response = await fetch("/api/monitoring/checkConnection", { method: "POST" });
            const data = await response.json();
            setResults(data.results);
        } catch (error) {
            console.error("Error fetching SQL status:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSQLStatus();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
            <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-6">
                สถานะ SQL Servers
            </h1>

            {loading ? (
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto"></div>
                    <p className="text-lg text-gray-700 dark:text-gray-300 mt-4">กำลังโหลด...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.map((result, index) => (
                        <div
                            key={index}
                            className={`p-6 rounded-lg shadow-lg ${
                                result.status === "ออนไลน์ปกติ" ? "bg-green-100" : "bg-red-100"
                            }`}
                        >
                            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                เซิร์ฟเวอร์: {result.server}
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300">
                                สถานะ:{" "}
                                <span
                                    className={`font-bold ${
                                        result.status === "ออนไลน์ปกติ"
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }`}
                                >
                                    {result.status}
                                </span>
                            </p>
                            <p className="text-gray-700 dark:text-gray-300">
                                ฐานข้อมูล: {result.database||"ไม่ได้เชื่อมต่อไปฐานข้อมูลต่างๆ  แค่ทดสอบการเชื่อมต่อจ้า"}
                            </p>
                            {result.error && (
                                <p className="text-red-600 dark:text-red-400">
                                    ข้อผิดพลาด: {result.error}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SQLStatusPage;
