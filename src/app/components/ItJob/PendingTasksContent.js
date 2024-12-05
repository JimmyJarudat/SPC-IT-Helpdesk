'use client';
import React, { useState, useEffect } from 'react';
import { useUser } from "@/contexts/UserContext";

const PendingTasksContent = () => {
    const { user } = useUser();
    const [selectedTask, setSelectedTask] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pendingTasks, setPendingTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTag, setSelectedTag] = useState("");
    const [isTagError, setIsTagError] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedTagCategory, setSelectedTagCategory] = useState("");


    const tagCategories = {
        program: ["Microsoft Office", "Power BI", "SAP"],
        device: ["คอมพิวเตอร์", "เครื่องปริ้น", "Router"],
        user: ["สร้างบัญชีใหม่", "รีเซ็ตรหัสผ่าน", "อบรมผู้ใช้งาน"],
        daily: ["ตรวจเช็คระบบ", "บำรุงรักษา", "รายงานผล"],
    };






    useEffect(() => {
        const fetchPendingTasks = async () => {
            try {
                const response = await fetch('/api/it-job/pendingJob'); // ปรับ endpoint ให้ตรงกับ API ของคุณ
                const data = await response.json();
                if (data.success && data.data.length > 0) {
                    setPendingTasks(data.data);
                } else {
                    console.warn('No pending jobs found.');
                    setPendingTasks([]); // ตั้งเป็น array ว่างหากไม่มีงาน
                }
            } catch (error) {
                console.error('Error fetching pending tasks:', error);
                setPendingTasks([]); // Default to an empty array on error
            } finally {
                setIsLoading(false);
            }
        };

        fetchPendingTasks();
    }, []);


    const handleViewDetails = (task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedTask(null);
        setIsModalOpen(false);
    };

    const handleAcceptTask = async (task) => {
        if (!selectedTag) {
            setIsTagError(true);
            setIsPopupOpen(true);
            return;
        }
        try {
            const jobOwner = {
                name: user.fullName,
                nickname: user.nickName,
                email: user.email,
                phone: user.phone,
            };

            const updateFields = {
                progress: "0%",
                tag: selectedTag,
            };

            console.log("Sending payload:", { jobID: task.jobID, jobOwner, updateFields });

            const response = await fetch("/api/it-job/pendingJob", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    jobID: task.jobID,
                    jobOwner,
                    updateFields,
                }),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                alert("รับงานสำเร็จ!");
                setIsModalOpen(false);
                setPendingTasks((prevTasks) => prevTasks.filter((t) => t.jobID !== task.jobID));
            } else {
                console.error("Error:", result.message);
                alert(`ไม่สามารถรับงานได้: ${result.message}`);
            }

        } catch (error) {
            console.error("Error accepting task:", error.message);
            alert("เกิดข้อผิดพลาดในการรับงาน");
        }
    };



    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
            <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6 dark:bg-gray-800">
                <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8 text-center">
                    งานรอดำเนินการ
                </h1>

                {Array.isArray(pendingTasks) && pendingTasks.length > 0 ? (
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
                                                ดูรายละเอียด
                                            </button>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                ) : (
                    <p className="text-center text-lg text-gray-600 dark:text-gray-300">
                        ไม่มีงานที่รอดำเนินการในขณะนี้
                    </p>
                )}




                {/* Modal แสดงรายละเอียด */}
                {isModalOpen && selectedTask && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl w-full dark:bg-gray-800">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                                    รายละเอียดงาน
                                </h2>
                                <button
                                    onClick={handleCloseModal}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-500"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Content */}
                            <div className="grid grid-cols-2 gap-4">
                                {/* Column 1 */}
                                <div>
                                    <p className="text-md text-gray-600 dark:text-gray-400 mb-2">
                                        <strong>เลขที่งาน:</strong> {selectedTask.jobID || '-'}
                                    </p>
                                    <p className="text-md text-gray-600 dark:text-gray-400 mb-2">
                                        <strong>ชื่องาน:</strong> {selectedTask.jobName || '-'}
                                    </p>
                                    <p className="text-md text-gray-600 dark:text-gray-400 mb-2">
                                        <strong>ประเภทงาน:</strong> {selectedTask.category || '-'}
                                    </p>

                                    <p className="text-md text-gray-600 dark:text-gray-400 mb-2">
                                        <strong>สถานะ:</strong> {selectedTask.status || '-'}
                                    </p>

                                    <p className="text-md text-gray-600 dark:text-gray-400 mb-2">
                                        <strong>วันที่สร้าง:</strong>{' '}
                                        {selectedTask.createdAt
                                            ? `${new Date(selectedTask.createdAt).toLocaleDateString('th-TH', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                            })} ${new Date(selectedTask.createdAt).toLocaleTimeString('th-TH', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: false,
                                            })} น.`
                                            : '-'}
                                    </p>

                                </div>

                                {/* Column 2 */}
                                <div>
                                    <p className="text-md text-gray-600 dark:text-gray-400 mb-2">
                                        <strong>ผู้แจ้ง:</strong> {selectedTask.fullName || '-'}
                                    </p>
                                    <p className="text-md text-gray-600 dark:text-gray-400 mb-2">
                                        <strong>อีเมล:</strong> {selectedTask.email || '-'}
                                    </p>
                                    <p className="text-md text-gray-600 dark:text-gray-400 mb-2">
                                        <strong>เบอร์โทร:</strong> {selectedTask.phoneNumber || '-'}
                                    </p>
                                    <p className="text-md text-gray-600 dark:text-gray-400 mb-2">
                                        <strong>แผนก:</strong> {selectedTask.department || '-'}
                                    </p>
                                    <p className="text-md text-gray-600 dark:text-gray-400 mb-2">
                                        <strong>บริษัท:</strong> {selectedTask.company || '-'}
                                    </p>
                                </div>
                            </div>

                            {/* แสดงแท็ก */}
                            <div className="mt-4">
                                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                                    เลือกแท็กที่เกี่ยวข้อง
                                </label>
                                <select
                                    value={selectedTag}
                                    onChange={(e) => {
                                        setSelectedTag(e.target.value);
                                        setIsTagError(false); // ล้างข้อผิดพลาดเมื่อเลือกแท็ก
                                    }}
                                    className={`w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-300 ${isTagError ? "border-red-500" : "border-gray-300"
                                        }`}
                                >
                                    <option value="">-- เลือกแท็ก --</option>
                                    {tagCategories[selectedTask.category]?.map((tag, index) => (
                                        <option key={index} value={tag}>
                                            {tag}
                                        </option>
                                    ))}
                                </select>
                                {isTagError && (
                                    <p className="text-red-500 text-sm mt-1">กรุณาเลือกแท็ก</p>
                                )}
                            </div>


                            {/* รายละเอียดเพิ่มเติม */}
                            <div className="mt-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    <strong>รายละเอียด:</strong>
                                </p>
                                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm text-gray-800 dark:text-gray-300">
                                    {selectedTask.jobDescription || 'ไม่มีรายละเอียดเพิ่มเติม'}
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end space-x-4 mt-6">
                                <button
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                                >
                                    ปิด
                                </button>
                                <button
                                    onClick={() => handleAcceptTask(selectedTask)}
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                                >
                                    รับงาน
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {selectedTagCategory && (
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">
                            แท็ก
                        </label>
                        <select
                            value={selectedTag}
                            onChange={(e) => setSelectedTag(e.target.value)}
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-300"
                        >
                            <option value="">-- เลือกแท็ก --</option>
                            {tagCategories[selectedTagCategory].map((tag, index) => (
                                <option key={index} value={tag}>
                                    {tag}
                                </option>
                            ))}
                        </select>
                    </div>
                )}






            </div>
        </div>
    );



};

export default PendingTasksContent;
