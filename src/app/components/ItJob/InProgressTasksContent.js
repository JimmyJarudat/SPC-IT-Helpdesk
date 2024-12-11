'use client';
import React, { useState, useEffect } from 'react';
import { useUser } from "@/contexts/UserContext";
import { useLoading } from "@/contexts/LoadingContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const InProgressTasksContent = () => {
    const { user } = useUser();
    const { loading, showLoading, hideLoading } = useLoading();
    const [pendingTasks, setPendingTasks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [showDeviceChangeForm, setShowDeviceChangeForm] = useState(false);
    const [closingTime, setClosingTime] = useState(''); // เก็บเวลาที่ผู้ใช้กรอก
    const [isTimeError, setIsTimeError] = useState(false); // แสดงข้อผิดพลาดเมื่อเวลาว่างเปล่า
    const [showClosingTimeForm, setShowClosingTimeForm] = useState(false); // ควบคุมการแสดงฟอร์มบันทึกเวลา
    const [timeErrorType, setTimeErrorType] = useState(""); // แยกประเภทข้อผิดพลาด
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [reload, setReload] = useState(false);



    const [closingDate, setClosingDate] = useState(() => {
        // ดึงวันที่ปัจจุบันในรูปแบบ Date object
        return new Date();
    });

    useEffect(() => {
        if (selectedTask && selectedTask.completionDate) {
            const completionDate = new Date(selectedTask.completionDate);

            // แปลงวันที่และเวลา
            setClosingDate(completionDate.toISOString().split("T")[0]); // ดึงวันที่ในรูปแบบ YYYY-MM-DD
            setClosingTime(
                `${completionDate.getHours().toString().padStart(2, "0")}:${completionDate
                    .getMinutes()
                    .toString()
                    .padStart(2, "0")}` // แปลงเวลาเป็น HH:MM
            );
        } else {
            // กำหนดค่าเริ่มต้นเป็นว่าง
            setClosingDate("");
            setClosingTime("");
        }
    }, [selectedTask]);

    const [deviceChangeInfo, setDeviceChangeInfo] = useState({
        oldDevice: '',
        newDevice: '',
        replacementDate: '',
        reason: '',
    });

    const handleViewDetails = (task) => {
        setSelectedTask(task);
        setDeviceChangeInfo(task.device_change_info || {
            oldDevice: '',
            newDevice: '',
            replacementDate: '',
            reason: '',
        });
        setIsModalOpen(true);
    };

    // ฟังก์ชันจัดการการเปลี่ยนแปลงข้อมูลฟอร์ม
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDeviceChangeInfo((prev) => ({ ...prev, [name]: value }));
    };
    // ฟังก์ชันจัดการวันที่จาก React DatePicker
    const handleDateChange = (date) => {
        setDeviceChangeInfo((prev) => ({ ...prev, replacementDate: date })); // อัปเดต Date object
    };

    useEffect(() => {
        if (closingDate && closingTime) {
            if (closingTime.length < 5) {
                setTimeErrorType(""); // รีเซ็ตข้อผิดพลาดเมื่อยังกรอกไม่ครบ
                setIsTimeError(false);
                return;
            }

            if (!isValidTime(closingTime)) {
                setPopupMessage("กรุณาระบุเวลาให้ถูกต้อง (เช่น 00:00 ถึง 23:59)");
                setIsPopupOpen(true);
                setTimeErrorType("invalidFormat");
                setIsTimeError(true);
                return;
            }

            const completionDate = combineDateAndTime(closingDate, closingTime);
            if (completionDate) {
                const createdAt = new Date(selectedTask?.createdAt);
                const completedDate = new Date(completionDate);

                // ตรวจสอบกรณีเวลาสิ้นสุดก่อนเวลาเริ่มต้น
                if (completedDate < createdAt) {
                    setPopupMessage("เวลาสิ้นสุดต้องไม่อยู่ก่อนเวลาเริ่มต้น");
                    setIsPopupOpen(true);
                    setTimeErrorType("invalidRange");
                    setIsTimeError(true);
                } else if (completedDate.getTime() === createdAt.getTime()) {
                    // หากเวลาสิ้นสุดเท่ากับเวลาเริ่มต้น ให้ถือว่าถูกต้อง
                    setTimeErrorType("");
                    setIsTimeError(false);
                } else {
                    setTimeErrorType("");
                    setIsTimeError(false);
                }
            }
        } else {
            setTimeErrorType("");
            setIsTimeError(false);
        }
    }, [closingDate, closingTime, selectedTask]);

    const isValidTime = (time) => {
        if (!time || time.length !== 5) return false; // ตรวจสอบรูปแบบ HH:MM
        const [hours, minutes] = time.split(":").map(Number);
        return (
            !isNaN(hours) &&
            !isNaN(minutes) &&
            hours >= 0 &&
            hours <= 23 &&
            minutes >= 0 &&
            minutes <= 59
        );
    };
    const combineDateAndTime = (date, time) => {
        // ตรวจสอบความถูกต้องของเวลา
        if (!isValidTime(time)) {
            console.error("Invalid time format:", time);
            return null;
        }

        const [hours, minutes] = time.split(":").map(Number);

        // หากไม่มีวันที่ ให้ใช้วันที่ปัจจุบัน
        const dateTime = date ? new Date(date) : new Date();

        // ตรวจสอบความถูกต้องของวันที่
        if (isNaN(dateTime)) {
            console.error("Invalid date format:", date);
            return null;
        }

        // ตั้งค่าเวลาที่เลือกในวันที่
        dateTime.setHours(hours, minutes, 0, 0);

        // แปลงเป็น ISO string และคืนค่า
        return dateTime.toISOString();
    };

    useEffect(() => {
        // ดึงข้อมูลจาก API
        const fetchPendingTasks = async () => {
            showLoading();
            try {


                const response = await fetch(`/api/it-job/InprogressJob?fullName=${encodeURIComponent(user.fullName)}`);
                const data = await response.json();
                if (data.success) {
                    // ตรวจสอบให้แน่ใจว่า data.data เป็น array
                    if (Array.isArray(data.data)) {
                        setPendingTasks(data.data);
                    } else {
                        console.error("Data from API is not an array:", data.data);
                        setPendingTasks([]);
                    }
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
    }, [user.fullName, reload]);


    // ฟังก์ชันปิด Modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTask(null);
    };

    // ฟังก์ชันบันทึกเวลา
    const calculateProcessTime = (createdAt, completionDate) => {
        if (!createdAt || !completionDate) return null;

        const createdDate = new Date(createdAt);
        const completedDate = new Date(completionDate);

        const diffMilliseconds = completedDate - createdDate;
        if (diffMilliseconds < 0) return "ไม่สามารถคำนวณได้ (เวลาสิ้นสุดอยู่ก่อนเวลาเริ่มต้น)"; // ป้องกันค่าติดลบ

        const diffMinutes = Math.floor(diffMilliseconds / (1000 * 60));
        const hours = Math.floor(diffMinutes / 60);
        const minutes = diffMinutes % 60;

        let result = '';
        if (hours > 0) result += `${hours} ชั่วโมง `;
        if (minutes > 0) result += `${minutes} นาที`;

        return result.trim(); // ลบช่องว่างส่วนเกิน
    };

    useEffect(() => {
        if (selectedTask && selectedTask.completionDate) {
            const completionDate = new Date(selectedTask.completionDate);

            setClosingDate(completionDate); // ใช้ Date object โดยตรง
            setClosingTime(
                `${completionDate.getHours().toString().padStart(2, "0")}:${completionDate
                    .getMinutes()
                    .toString()
                    .padStart(2, "0")}`
            );
        } else {
            setClosingDate(""); // ค่าเริ่มต้นหากไม่มี completionDate
            setClosingTime("");
        }
    }, [selectedTask]);

    const handleSaveTask = async () => {
        if (!selectedTask) return;
        if (isTimeError) {
            setPopupMessage("กรุณาแก้ไขข้อผิดพลาดก่อนบันทึก");
            setIsPopupOpen(true);
            return;
        }

        try {
            showLoading();

            let completionDate;

            if (!closingDate && !closingTime) {
                // ไม่มีการกรอกทั้งวันที่และเวลา -> ใช้เวลาปัจจุบัน
                completionDate = new Date().toISOString();
            } else if (!closingDate) {
                // กรอกเวลา แต่ไม่กรอกวันที่ -> ใช้วันที่ปัจจุบัน
                completionDate = combineDateAndTime(new Date(), closingTime);
            } else if (!closingTime) {
                // กรอกวันที่ แต่ไม่กรอกเวลา -> ใช้เวลาเริ่มต้นของวัน (00:00)
                completionDate = combineDateAndTime(closingDate, "00:00");
            } else {
                // มีทั้งวันที่และเวลา
                completionDate = combineDateAndTime(closingDate, closingTime);
            }

            if (!completionDate) {
                setPopupMessage("กรุณากรอกวันที่และเวลาที่ถูกต้อง");
                setIsPopupOpen(true);
                return;
            }




            // ตรวจสอบเวลาสิ้นสุดไม่อยู่ก่อนเวลาเริ่มต้น
            const createdAt = selectedTask?.createdAt;
            if (new Date(completionDate) < new Date(createdAt)) {
                setPopupMessage("เวลาสิ้นสุดต้องไม่อยู่ก่อนเวลาเริ่มต้น");
                setIsPopupOpen(true); // เปิด Popup
                hideLoading();
                return;
            }

            // ตรวจสอบและอัปเดตสถานะงาน
            let updatedStatus = selectedTask.status;
            if (selectedTask.status === "completed") {
                const dueDate = new Date(selectedTask.dueDate);
                const completedDate = new Date(selectedTask.completionDate);
                if (completedDate > dueDate) {
                    updatedStatus = "completed_Late"; // เปลี่ยนเป็น completed_Late
                }
            }

            // คำนวณ processTime
            const processTime = calculateProcessTime(selectedTask.createdAt, completionDate);

            const updateFields = {
                resolution_notes: selectedTask.resolution_notes,
                status: updatedStatus,
                completionDate: selectedTask.completionDate || null,
                completionDate,
                processTime,
                device_change_info: deviceChangeInfo,
            };

            const response = await fetch("/api/it-job/InprogressJob", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    jobID: selectedTask.jobID,
                    updateFields,
                }),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setPopupMessage("บันทึกข้อมูลสำเร็จ!");
                setIsPopupOpen(true); // เปิด Popup
                setIsModalOpen(false);
                // ตรวจสอบก่อนใช้ map
                setPendingTasks((prevTasks) => {
                    if (!Array.isArray(prevTasks)) {
                        console.error("prevTasks is not an array:", prevTasks);
                        return [];
                    }
                    return prevTasks.map((task) =>
                        task.jobID === selectedTask.jobID ? { ...task, ...updateFields } : task
                    );
                });
                // อัปเดต State ของ selectedTask

                setSelectedTask((prev) => ({ ...prev, ...updateFields }));
                setReload((prev) => !prev);
            } else {
                alert(`เกิดข้อผิดพลาด: ${result.message}`);
            }
        } catch (error) {
            console.error("Error saving task:", error.message);
            alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        } finally {
            hideLoading();
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
            <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6 dark:bg-gray-800">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-4">
                        งานที่กำลังดำเนินการ
                    </h1>
                    <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
                        จำนวนงานทั้งหมด: <span className="text-blue-600 dark:text-blue-400">{pendingTasks.length}</span> งาน
                    </p>
                    <div className="mt-4">
                        <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
                    </div>
                </div>


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
                                        key={`${task.jobID || 'unknown'}-${index}`}
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
                                    <p
                                        className={`text-md mb-2 ${selectedTask.dueDate && new Date(selectedTask.dueDate) < new Date()
                                            ? 'text-red-500' // สีแดงหากเลยกำหนด
                                            : 'text-gray-600 dark:text-gray-400' // สีปกติ
                                            }`}
                                    >
                                        <strong>กำหนดเสร็จ:</strong>{' '}
                                        {selectedTask.dueDate
                                            ? `${new Date(selectedTask.dueDate).toLocaleDateString('th-TH', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                            })} ${new Date(selectedTask.dueDate).toLocaleTimeString('th-TH', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: false,
                                            })} น.`
                                            : '-'}
                                    </p>
                                    {selectedTask.completionDate && (
                                        <p className="text-md text-gray-600 dark:text-gray-400 mb-2">
                                            <strong>วันที่เสร็จ:</strong>{' '}
                                            {selectedTask.completionDate
                                                ? `${new Date(selectedTask.completionDate).toLocaleDateString('th-TH', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                })} ${new Date(selectedTask.completionDate).toLocaleTimeString('th-TH', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: false,
                                                })} น.`
                                                : 'กำลังดำเนินการ'}
                                        </p>
                                    )}
                                    {selectedTask.processTime && (
                                        <p className="text-md text-gray-600 dark:text-gray-400 mb-2">
                                            <strong>เวลาในการดำเนินการ:</strong> {selectedTask.processTime || 'ยังไม่มีข้อมูล'}
                                        </p>
                                    )}


                                    <div className="mb-2">
                                        <label className="text-md text-gray-600 dark:text-gray-400 mb-1">
                                            <strong>สถานะงาน:</strong>
                                        </label>
                                        <select
                                            value={selectedTask.status || ''} // แสดงสถานะปัจจุบัน
                                            onChange={(e) => setSelectedTask({ ...selectedTask, status: e.target.value })} // อัปเดตสถานะ
                                            className="w-full p-2 border rounded text-gray-700 dark:bg-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
                                        >
                                            <option value="">-- เลือกสถานะงาน --</option>
                                            <option value="pending">รอดำเนินการ</option>
                                            <option value="in_progress">กำลังดำเนินการ</option>
                                            <option value="completed">เสร็จสิ้น</option>
                                        </select>
                                    </div>

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
                                </div>
                            </div>

                            {/* รายละเอียดการแก้ไข */}
                            <div className="mt-4">
                                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    <strong>รายละเอียดการแก้ไข:</strong>
                                </label>
                                <textarea
                                    value={selectedTask.resolution_notes || ''} // ผูกค่ากับ selectedTask
                                    onChange={(e) =>
                                        setSelectedTask({ ...selectedTask, resolution_notes: e.target.value }) // แก้ไขค่าใน selectedTask
                                    }
                                    className="w-full p-3 border rounded dark:bg-gray-700 dark:text-gray-300"
                                    rows="4"
                                    placeholder="เพิ่มรายละเอียดการแก้ไข..."
                                ></textarea>
                            </div>







                            {/* ปุ่มสำหรับเปลี่ยนอุปกรณ์และบันทึกเวลา */}
                            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:gap-6">
                                {/* เปลี่ยนอุปกรณ์ */}
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={showDeviceChangeForm}
                                        onChange={(e) => setShowDeviceChangeForm(e.target.checked)}
                                        className="form-checkbox h-5 w-5 text-blue-600"
                                    />
                                    <label className="ml-2 text-gray-600 dark:text-gray-400">
                                        เปลี่ยนอุปกรณ์
                                    </label>
                                </div>

                                {/* บันทึกเวลาในการปิดงาน */}
                                <div className="flex items-center mt-4 sm:mt-0">
                                    <input
                                        type="checkbox"
                                        checked={showClosingTimeForm}
                                        onChange={(e) => setShowClosingTimeForm(e.target.checked)}
                                        className="form-checkbox h-5 w-5 text-blue-600"
                                    />
                                    <label className="ml-2 text-gray-600 dark:text-gray-400">
                                        บันทึกเวลาในการปิดงาน
                                    </label>
                                </div>
                            </div>


                            {/* Form บันทึกเวลา */}
                            {showClosingTimeForm && (
                                <div className="mt-4 ml-6">
                                    <label className="block text-md font-medium text-gray-600 dark:text-gray-400 mb-2">
                                        วันที่และเวลาในการปิดงาน
                                    </label>
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                                        {/* ช่องกรอกวันที่ */}
                                        <div className="relative w-full sm:w-40">

                                            <DatePicker
                                                selected={closingDate}
                                                onChange={(date) => setClosingDate(date)}
                                                dateFormat="dd/MM/yyyy"
                                                className="w-full p-3 border rounded-lg text-center text-gray-700 dark:bg-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
                                                placeholderText="เลือกวันที่"
                                            />
                                        </div>

                                        {/* ช่องกรอกเวลา */}
                                        <div className="relative w-full sm:w-32">
                                            <input
                                                type="text"
                                                maxLength={5}
                                                value={closingTime}
                                                onChange={(e) => {
                                                    const input = e.target.value.replace(/[^0-9]/g, "");
                                                    if (input.length <= 4) {
                                                        const formattedTime =
                                                            input.length > 2 ? `${input.slice(0, 2)}:${input.slice(2)}` : input;
                                                        setClosingTime(formattedTime);

                                                        // ตรวจสอบเวลา
                                                        if (formattedTime.length === 5) {
                                                            const [hours, minutes] = formattedTime.split(":").map(Number);
                                                            setIsTimeError(!(hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59));
                                                        } else {
                                                            setIsTimeError(false);
                                                        }
                                                    }
                                                }}
                                                placeholder="ระบุเวลา เช่น 17:00"
                                                className={`w-full p-3 border rounded-lg text-center text-gray-700 dark:bg-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 ${isTimeError ? "border-red-500 dark:border-red-700" : "border-gray-300"
                                                    }`}
                                            />
                                        </div>
                                    </div>

                                    {/* ข้อความแจ้งข้อผิดพลาด */}
                                    {isTimeError && (
                                        <>
                                            {timeErrorType === "invalidFormat" && (
                                                <p className="text-red-500 text-sm mt-2 sm:mt-1">
                                                    กรุณาระบุเวลาให้ถูกต้อง (เช่น 00:00 ถึง 23:59)
                                                </p>
                                            )}
                                            {timeErrorType === "invalidRange" && (
                                                <p className="text-red-500 text-sm mt-2">
                                                    กรุณาตรวจสอบเวลา: เวลาสิ้นสุดต้องไม่อยู่ก่อนเวลาเริ่มต้น
                                                </p>
                                            )}
                                        </>
                                    )}

                                </div>
                            )}







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
                                            value={deviceChangeInfo.oldDevice || ""}
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
                                            value={deviceChangeInfo.newDevice || ""}
                                            onChange={handleInputChange}
                                            className="w-full mt-1 p-2 border rounded dark:bg-gray-700 dark:text-gray-300"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-600 dark:text-gray-400">
                                            วันที่เปลี่ยน
                                        </label>
                                        <DatePicker
                                            selected={deviceChangeInfo.replacementDate}
                                            onChange={handleDateChange}
                                            dateFormat="dd/MM/yyyy" // เปลี่ยนรูปแบบแสดงผล
                                            className="w-full mt-1 p-2 border rounded dark:bg-gray-700 dark:text-gray-300"
                                            placeholderText="เลือกวันที่ (วัน/เดือน/ปี)"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-600 dark:text-gray-400">
                                            เหตุผล
                                        </label>
                                        <textarea
                                            name="reason"
                                            value={deviceChangeInfo.reason || ""}
                                            onChange={handleInputChange}
                                            className="w-full mt-1 p-2 border rounded dark:bg-gray-700 dark:text-gray-300"
                                            rows="3"
                                        ></textarea>
                                    </div>
                                </div>
                            )}




                            <div className="flex justify-end space-x-4 mt-6">
                                <button
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                                >
                                    ปิด
                                </button>
                                <button
                                    onClick={() => handleSaveTask(pendingTasks)}
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                                >
                                    บันทึก
                                </button>
                            </div>
                        </div>
                    </div>
                )}




            </div>


            {isPopupOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full dark:bg-gray-800">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-700 dark:text-white">
                                การแจ้งเตือน
                            </h2>
                            <button
                                onClick={() => setIsPopupOpen(false)} // ปิด Popup
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-500"
                            >
                                ✕
                            </button>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300">{popupMessage}</p>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => setIsPopupOpen(false)} // ปิด Popup
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                            >
                                ปิด
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </div>
    )
};

export default InProgressTasksContent;