'use client';
import React, { useState, useEffect } from 'react';
import { useUser } from "@/contexts/UserContext";
import { useLoading } from "@/contexts/LoadingContext";


const InProgressTasksContent = () => {
    const { user } = useUser();
    const { loading, showLoading, hideLoading } = useLoading();
    const [pendingTasks, setPendingTasks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [showDeviceChangeForm, setShowDeviceChangeForm] = useState(false);

    const [deviceChangeInfo, setDeviceChangeInfo] = useState({
        oldDevice: '',
        newDevice: '',
        replacementDate: '',
        reason: '',
    });

    // ฟังก์ชันจัดการการเปลี่ยนแปลงข้อมูลฟอร์ม
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDeviceChangeInfo((prev) => ({ ...prev, [name]: value }));
    };





    useEffect(() => {
        // ดึงข้อมูลจาก API
        const fetchPendingTasks = async () => {
            showLoading();
            try {
                const response = await fetch(`/api/it-job/InprogressJob?fullName=${encodeURIComponent(user.fullName)}`);
                const data = await response.json();
                if (data.success) {
                    setPendingTasks(data.data);
                } else {
                    console.error('Error fetching pending tasks:', data.message);
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                hideLoading();
            }
        };

        fetchPendingTasks();
    }, [user.fullName]);

    // ฟังก์ชันเปิด Modal
    const handleViewDetails = (task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    // ฟังก์ชันปิด Modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTask(null);
    };


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


                {/* Modal แสดงรายละเอียด */}
                {isModalOpen && selectedTask && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div
                            className="bg-white rounded-lg shadow-lg p-6 max-w-full sm:max-w-lg lg:max-w-3xl w-full dark:bg-gray-800 overflow-y-auto max-h-screen"
                        >
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                        <strong>แท็ก:</strong> {selectedTask.tag || '-'}
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
                                    {selectedTask.attachment && (
                                        <div className="mt-4">
                                            <label className="block text-md text-gray-600 dark:text-gray-400 mb-2">
                                                <strong>ภาพที่เกี่ยวข้อง:</strong>
                                            </label>
                                            <button
                                                onClick={() => window.open(selectedTask.attachment, "_blank")}
                                                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md transition focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-800"
                                            >
                                                ดูภาพ
                                            </button>
                                        </div>
                                    )}
                                    <p className="text-md text-gray-600 dark:text-gray-400 mb-2">
                                        <strong>รายละเอียดงาน:</strong> {selectedTask.jobDescription || '-'}
                                    </p>

                                </div>

                                {/* Column 2 */}
                                <div>
                                    <p className="text-md text-gray-600 dark:text-gray-400 mb-2">
                                        <strong>ผู้แจ้ง:</strong> {selectedTask.fullName || '-'}
                                    </p>
                                    <p className="text-md text-gray-600 dark:text-gray-400 mb-2">
                                        <strong>ชื่อเล่นผู้แจ้ง:</strong> {selectedTask.nickName || '-'}
                                    </p>
                                    <p className="text-md text-gray-600 dark:text-gray-400 mb-2">
                                        <strong>อีเมล:</strong> {selectedTask.email || '-'}
                                    </p>
                                    <p className="text-md text-gray-600 dark:text-gray-400 mb-2">
                                        <strong>เบอร์โทร:</strong> {selectedTask.phoneNumber || '-'}
                                    </p>
                                    <p className="text-md text-gray-600 dark:text-gray-400 mb-2">
                                        <strong>ตำแหน่ง:</strong> {selectedTask.position || '-'}
                                    </p>
                                    <p className="text-md text-gray-600 dark:text-gray-400 mb-2">
                                        <strong>แผนก:</strong> {selectedTask.department || '-'}
                                    </p>
                                    <p className="text-md text-gray-600 dark:text-gray-400 mb-2">
                                        <strong>ฝ่าย:</strong> {selectedTask.division || '-'}
                                    </p>
                                    <p className="text-md text-gray-600 dark:text-gray-400 mb-2">
                                        <strong>บริษัท:</strong> {selectedTask.company || '-'}
                                    </p>
                                    <p className="text-md text-gray-600 dark:text-gray-400 mb-2">
                                        <strong>สถานที่:</strong> {selectedTask.location || '-'}
                                    </p>
                                </div>
                            </div>

                            {/* รายละเอียดเพิ่มเติม */}
                            <div className="mt-4">
                                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    <strong>รายละเอียดการแก้ไข:</strong>
                                </label>
                                <textarea
                                    value={pendingTasks.resolution_notes || ''}
                                    onChange={(e) =>
                                        setPendingTasks({ ...pendingTasks, jobDescription: e.target.value })
                                    }
                                    className="w-full p-3 border rounded dark:bg-gray-700 dark:text-gray-300"
                                    rows="4"
                                ></textarea>
                            </div>






                            {/* ปุ่มสำหรับเปลี่ยนอุปกรณ์ */}
                            <div className="mt-4">
                                <label className="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={showDeviceChangeForm}
                                        onChange={(e) => setShowDeviceChangeForm(e.target.checked)}
                                        className="form-checkbox h-5 w-5 text-blue-600"
                                    />
                                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                                        เปลี่ยนอุปกรณ์
                                    </span>
                                </label>
                            </div>

                            {/* UI เปลี่ยนอุปกรณ์ */}
                            {showDeviceChangeForm && (
                                <div className="mt-4 col-span-2">
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                                        รายละเอียดการเปลี่ยนอุปกรณ์
                                    </h3>
                                    <div className="mb-4">
                                        <label className="block text-gray-600 dark:text-gray-400">
                                            อุปกรณ์เดิม
                                        </label>
                                        <input
                                            type="text"
                                            name="oldDevice"
                                            value={deviceChangeInfo.oldDevice}
                                            onChange={handleInputChange}
                                            className="w-full mt-1 p-2 border rounded dark:bg-gray-700 dark:text-gray-300"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-600 dark:text-gray-400">
                                            อุปกรณ์ใหม่
                                        </label>
                                        <input
                                            type="text"
                                            name="newDevice"
                                            value={deviceChangeInfo.newDevice}
                                            onChange={handleInputChange}
                                            className="w-full mt-1 p-2 border rounded dark:bg-gray-700 dark:text-gray-300"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-600 dark:text-gray-400">
                                            วันที่เปลี่ยน
                                        </label>
                                        <input
                                            type="date"
                                            name="replacementDate"
                                            value={deviceChangeInfo.replacementDate}
                                            onChange={handleInputChange}
                                            className="w-full mt-1 p-2 border rounded dark:bg-gray-700 dark:text-gray-300"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-600 dark:text-gray-400">
                                            เหตุผล
                                        </label>
                                        <textarea
                                            name="reason"
                                            value={deviceChangeInfo.reason}
                                            onChange={handleInputChange}
                                            className="w-full mt-1 p-2 border rounded dark:bg-gray-700 dark:text-gray-300"
                                            rows="3"
                                        ></textarea>
                                    </div>
                                </div>
                            )}



                            {/* Buttons */}
                            <div className="flex justify-end space-x-4 mt-6">
                                <button
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                                >
                                    ปิด
                                </button>
                                <button
                                    onClick={() => handleAcceptTask(pendingTasks)}
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                                >
                                    รับงาน
                                </button>
                            </div>
                        </div>
                    </div>
                )}




            </div>
        </div>
    )
};

export default InProgressTasksContent;