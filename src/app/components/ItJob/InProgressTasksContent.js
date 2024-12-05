'use client';
import React, { useState, useEffect } from 'react';
import { useUser } from "@/contexts/UserContext";


const InProgressTasksContent = () => {
    const { user } = useUser();
    const [pendingTasks, setPendingTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTag, setSelectedTag] = useState("");
    
    useEffect(() => {
        // ดึงข้อมูลจาก API
        const fetchPendingTasks = async () => {
            try {
                const response = await fetch('/api/it-job/InprogressJob'); // ปรับ endpoint ให้ตรงกับ API ของคุณ
                const data = await response.json();
                if (data.success) {
                    setPendingTasks(data.data);
                } else {
                    console.error('Error fetching pending tasks:', data.message);
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPendingTasks();
    }, []);

   
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
            <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6 dark:bg-gray-800">
                <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8 text-center">
                    งานรอดำเนินการ
                </h1>

                {pendingTasks.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto border-collapse">
                            <thead>
                                <tr className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                                    <th className="p-4 border-b border-gray-300 dark:border-gray-600 w-12 text-center">ลำดับ</th>
                                    <th className="p-4 border-b border-gray-300 dark:border-gray-600 w-40 text-center">เลขที่งาน</th>
                                    <th className="p-4 border-b border-gray-300 dark:border-gray-600 w-60">ชื่องาน</th>
                                    <th className="p-4 border-b border-gray-300 dark:border-gray-600 w-40 text-center">ประเภทงาน</th>
                                    <th className="p-4 border-b border-gray-300 dark:border-gray-600 w-40 text-center">ผู้แจ้ง</th>
                                    <th className="p-4 border-b border-gray-300 dark:border-gray-600 w-40 text-center">เบอร์ผู้แจ้ง</th>
                                    <th className="p-4 border-b border-gray-300 dark:border-gray-600 w-40 text-center">วันที่แจ้ง</th>
                                    <th className="p-4 border-b border-gray-300 dark:border-gray-600 w-32 text-center">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingTasks.map((task, index) => (
                                    <tr
                                        key={task.id || index}
                                        className="text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <td className="p-4 border-b border-gray-300 dark:border-gray-600 text-center">
                                            {index + 1}
                                        </td>
                                        <td className="p-4 border-b border-gray-300 dark:border-gray-600 text-center">
                                            {task.jobID}
                                        </td>
                                        <td className="p-4 border-b border-gray-300 dark:border-gray-600 relative group">
                                            <span className="truncate block max-w-xs">{task.jobName.length > 20 ? `${task.jobName.slice(0, 20)}...` : task.jobName}</span>
                                            <div className="absolute hidden group-hover:block bg-gray-800 text-white text-sm rounded p-2 -top-8  transform -translate-x-1/2 shadow-lg max-w-xs">
                                                {task.jobName}
                                            </div>
                                        </td>

                                        <td className="p-4 border-b border-gray-300 dark:border-gray-600 text-center">
                                            <span
                                                className={`px-2 py-1 rounded-full text-white ${task.category === "user"
                                                    ? "bg-blue-500"
                                                    : task.category === "program"
                                                        ? "bg-green-500"
                                                        : "bg-red-500"
                                                    }`}
                                            >
                                                {task.category}
                                            </span>
                                        </td>
                                        <td className="p-4 border-b border-gray-300 dark:border-gray-600 text-center relative group">
                                            <span>{task.nickName}</span>
                                            <div className="absolute hidden group-hover:block bg-gray-800 text-white text-sm rounded p-2 -top-8 left-1/2 transform -translate-x-1/2 shadow-lg whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                                                {task.fullName}
                                            </div>
                                        </td>


                                        <td className="p-4 border-b border-gray-300 dark:border-gray-600 text-center">
                                            {task.phoneNumber}
                                        </td>
                                        <td className="p-4 border-b border-gray-300 dark:border-gray-600 text-center relative group">
                                            <span>
                                                {new Date(task.createdAt).toLocaleDateString('th-TH', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                })}
                                            </span>
                                            <div className="absolute hidden group-hover:block bg-gray-800 text-white text-sm rounded p-2 -top-8 left-1/2 transform -translate-x-1/2 shadow-lg">
                                                {new Date(task.createdAt).toLocaleTimeString('th-TH', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: false,
                                                }) + ' น.'}
                                            </div>
                                        </td>


                                        <td className="p-3 text-center border-b whitespace-nowrap">
                                            <button
                                                onClick={() => handleViewDetails(task)}
                                                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded shadow-md transition focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-800"
                                            >
                                                บันทึกการทำงาน
                                            </button>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                ) : (
                    <p className="text-center text-lg text-gray-600 dark:text-gray-300">
                        ไม่มีงานที่กำลังดำเนินการในขณะนี้
                    </p>
                )}




                

                
            </div>
        </div>
    )
};

export default InProgressTasksContent;