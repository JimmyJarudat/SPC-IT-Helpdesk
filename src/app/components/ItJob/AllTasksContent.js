"use client";

import { useState, useEffect } from "react";
import { getColorFromTheme } from '@/utils/colorMapping';
import { useTheme } from "@/contexts/ThemeContext";
import { FaCheck } from "react-icons/fa";
import { FaTimes, FaMapMarkerAlt, FaUser, FaClock, FaCheckCircle } from "react-icons/fa";

import { useLoading } from "@/contexts/LoadingContext";


import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-calendar/dist/Calendar.css";



const AllTasksContent = () => {
    const { theme } = useTheme();
    const [tasks, setTasks] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
    const [filters, setFilters] = useState({ startDate: "", endDate: "" });
    const { loading, showLoading, hideLoading } = useLoading();

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20; // จำนวนรายการต่อหน้า

    const [searchQuery, setSearchQuery] = useState("");
    const [sortOption, setSortOption] = useState("desc");
    const [totalFiltered, setTotalFiltered] = useState(0);
    const [categoryFilter, setCategoryFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const handleViewDetails = (task) => {
        setSelectedTask(task); // เก็บข้อมูลงานที่เลือก
        setModalOpen(true); // เปิด Modal
    };

    const closeModal = () => {
        setModalOpen(false); // ปิด Modal
        setSelectedTask(null); // รีเซ็ตข้อมูลงาน
    };






    const fetchTasks = async () => {
        showLoading(); // แสดง Spinner
        setTasks([]); // รีเซ็ต tasks ก่อนโหลดข้อมูลใหม่
        try {
            const params = new URLSearchParams({
                page: currentPage,
                limit: itemsPerPage,
                sort: sortOption,
                search: searchQuery,
                startDate: filters.startDate,
                endDate: filters.endDate,
                category: categoryFilter, // เพิ่มตัวกรองหมวดหมู่
                status: statusFilter,    // เพิ่มตัวกรองสถานะ
            });

            const response = await fetch(`/api/it-job/allJob?${params.toString()}`);
            const data = await response.json();

            if (response.ok && data.success) {
                setTasks(data.data); // โหลดข้อมูลใหม่
                setPagination((prev) => ({
                    ...prev,
                    totalPages: data.pagination.totalPages, // อัปเดต totalPages จาก API
                }));
                setTotalFiltered(data.pagination.total);
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error("Error fetching tasks:", error.message);
        } finally {
            hideLoading(); // ซ่อน Spinner
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [sortOption, currentPage, filters]);

    useEffect(() => {
        // เรียก fetchTasks ทุกครั้งที่ searchQuery เปลี่ยน
        const timeoutId = setTimeout(() => {
            fetchTasks();
        }, 500); // หน่วงเวลา 500ms เพื่อลดการเรียก API ที่ไม่จำเป็น

        return () => clearTimeout(timeoutId); // เคลียร์ timeout หาก searchQuery เปลี่ยนก่อนครบ 500ms
    }, [searchQuery]);

    useEffect(() => {
        console.log("Current Page:", currentPage);
        fetchTasks();
    }, [currentPage, filters, categoryFilter, statusFilter]);

    const handlePageChange = (page) => {
        if (page > 0 && page <= pagination.totalPages) {
            setCurrentPage(page);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const resetFilters = () => {
        setFilters({ startDate: "", endDate: "" });
        setSortOption("desc"),
            setCategoryFilter("");
        setStatusFilter("");
        setSearchQuery("");
        setCurrentPage(1); // รีเซ็ตหน้าให้กลับไปเริ่มต้น
        fetchTasks(); // เรียกข้อมูลใหม่
    };


    return (
        <div
            className="p-6 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-screen"
        >
            <h1
                className="text-2xl font-bold mb-4"
                style={{
                    color: theme.mode === "dark" ? "#FFFFFF" : "#000000", // เปลี่ยนสีข้อความตามธีม
                }}
            >
                งานทั้งหมดใน
                {filters.startDate && filters.endDate
                    ? ` เดือน ${new Date(filters.startDate).toLocaleString("th-TH", { month: "long" })}` +
                    (new Date(filters.startDate).getMonth() !== new Date(filters.endDate).getMonth()
                        ? ` - เดือน ${new Date(filters.endDate).toLocaleString("th-TH", { month: "long" })}`
                        : "")
                    : `เดือน ${new Date().toLocaleString("th-TH", { month: "long" })}`}
            </h1>


            {/* จำนวนงาน */}
            <div className="mb-4 flex items-center gap-2 bg-blue-50 dark:bg-gray-800 p-4 rounded-lg shadow">
                <p className="text-gray-800 dark:text-gray-100">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                        จำนวนงานทั้งหมด:
                    </span>{" "}
                    {totalFiltered} งาน
                </p>
            </div>



            {/* ตัวกรอง */}
            <div className="mb-6 flex flex-wrap gap-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow">
                <input
                    type="text"
                    placeholder="🔍 ค้นหา (เช่น เลขที่งาน, ชื่องาน, ผู้แจ้ง)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border px-4 py-2 rounded-lg w-full sm:w-1/3 focus:ring focus:ring-blue-300 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                />
                <DatePicker
                    selected={filters.startDate ? new Date(filters.startDate) : null}
                    onChange={(date) =>
                        handleFilterChange({
                            target: {
                                name: "startDate",
                                value: date ? date.toISOString().split("T")[0] : "", // ตัดเวลาออก เหลือแค่ YYYY-MM-DD
                            },
                        })
                    }
                    placeholderText="📅 วันที่เริ่มต้น"
                    dateFormat="dd/MM/yyyy"
                    className="w-full border px-4 py-2 rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    showYearDropdown
                    yearDropdownItemNumber={24}
                    scrollableYearDropdown
                />

                <DatePicker
                    selected={filters.endDate ? new Date(filters.endDate) : null}
                    onChange={(date) =>
                        handleFilterChange({
                            target: {
                                name: "endDate",
                                value: date ? date.toISOString().split("T")[0] : "", // ตัดเวลาออก เหลือแค่ YYYY-MM-DD
                            },
                        })
                    }
                    placeholderText="📅 วันที่สิ้นสุด"
                    dateFormat="dd/MM/yyyy"
                    className="w-full border px-4 py-2 rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    showYearDropdown
                    yearDropdownItemNumber={24}
                    scrollableYearDropdown
                />

                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="border px-4 py-2 rounded-lg w-full sm:w-1/4 focus:ring focus:ring-blue-300 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                >
                    <option value="">📦 ทั้งหมด</option>
                    <option value="device">💻 Hardware</option>
                    <option value="software">📱 Software</option>
                    <option value="user">👤 User</option>
                    <option value="daily">🌐 Daily</option>
                </select>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border px-4 py-2 rounded-lg w-full sm:w-1/4 focus:ring focus:ring-blue-300 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                >
                    <option value="">📂 ทั้งหมด</option>
                    <option value="completed">✅ Completed</option>
                    <option value="completed_Late">❌ Completed Late</option>
                    <option value="in_progress">🕒 In Progress</option>
                    <option value="pending">⏳ Pending</option>
                </select>

                <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="border px-4 py-2 rounded-lg w-full sm:w-1/4 focus:ring focus:ring-blue-300 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                >
                    <option value="asc">🔼 เรียงจากน้อยไปมาก</option>
                    <option value="desc">🔽 เรียงจากมากไปน้อย</option>
                </select>

                {/* ปุ่มล้างตัวกรอง */}
                <button
                    onClick={resetFilters}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    ล้างตัวกรอง
                </button>
            </div>


            {/* Tasks Table */}
            {!loading && tasks.length > 0 && (
                <div className="mt-6">
                    <table className="table-auto w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                                <th className="border border-gray-300 dark:border-gray-600 py-2">ลำดับ</th>
                                <th className="border border-gray-300 dark:border-gray-600 py-2">เลขที่งาน</th>
                                <th className="border border-gray-300 dark:border-gray-600 py-2">ชื่องาน</th>
                                <th className="border border-gray-300 dark:border-gray-600 py-2">ประเภท</th>
                                <th className="border border-gray-300 dark:border-gray-600 py-2">วันที่แจ้ง</th>
                                <th className="border border-gray-300 dark:border-gray-600 py-2">ผู้แจ้ง</th>
                                <th className="border border-gray-300 dark:border-gray-600 py-2">ผู้ปฏิบัติงาน</th>
                                <th className="border border-gray-300 dark:border-gray-600 py-2">เวลาที่เสร็จ</th>
                                <th className="border border-gray-300 dark:border-gray-600 py-2">สถานะ</th>
                                <th className="border border-gray-300 dark:border-gray-600 py-2">เวลาที่ใช้ทำงาน</th>
                                <th className="border border-gray-300 dark:border-gray-600 py-2">รายละเอียด</th>
                            </tr>
                        </thead>

                        <tbody>
                            {tasks.map((task, index) => (

                                <tr key={task.jobID} className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                                    {/* คำนวณลำดับโดยบวกกับ (currentPage - 1) * itemsPerPage */}
                                    <td className="border border-gray-300 dark:border-gray-600 py-2 text-center">
                                        {index + 1 + (currentPage - 1) * itemsPerPage}
                                    </td>
                                    <td className="border border-gray-300 dark:border-gray-600 py-2 text-center">{task.jobID}</td>
                                    <td className="relative group border border-gray-300 dark:border-gray-600 py-2 px-2">
                                        {task.jobName.length > 30 ? task.jobName.substring(0, 30) + "..." : task.jobName}
                                        <span
                                            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:inline-block bg-gray-800 text-white text-xs py-1 px-2 rounded shadow-lg whitespace-nowrap"
                                        >
                                            {task.jobName} {/* แสดงชื่อเต็ม */}
                                        </span>
                                    </td>


                                    <td className="border border-gray-300 dark:border-gray-600  text-center align-middle">{task.category
                                    }</td>
                                    <td
                                        className="relative group border border-gray-300 dark:border-gray-600 text-center align-middle"
                                    >
                                        {new Date(task.createdAt).toLocaleDateString("en-GB")}
                                        <span
                                            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:inline-block bg-gray-800 text-white text-xs py-1 px-2 rounded shadow-lg whitespace-nowrap"
                                        >
                                            {new Date(task.createdAt).toLocaleTimeString("th-TH", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })} น.
                                        </span>
                                    </td>
                                    {task.nickName && (
                                        <td className="relative group border border-gray-300 dark:border-gray-600 px-4 text-center align-middle">
                                            {task.nickName}
                                            {task.fullName && (
                                                <span
                                                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:inline-block bg-gray-800 text-white text-xs py-1 px-2 rounded shadow-lg whitespace-nowrap"
                                                >
                                                    {task.fullName}
                                                </span>
                                            )}
                                        </td>
                                    )}
                                    {task.nicknameJob_owner && (
                                        <td className="relative group border border-gray-300 dark:border-gray-600 px-4 text-center align-middle">
                                            {task.nicknameJob_owner}
                                            {task.nameJob_owner && (
                                                <span
                                                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:inline-block bg-gray-800 text-white text-xs py-1 px-2 rounded shadow-lg whitespace-nowrap"
                                                >
                                                    {task.nameJob_owner}
                                                </span>
                                            )}
                                        </td>
                                    )}
                                    <td
                                        className="relative group border border-gray-300 dark:border-gray-600 text-center align-middle"
                                    >
                                        {new Date(task.completionDate).toLocaleDateString("en-GB")}
                                        <span
                                            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:inline-block bg-gray-800 text-white text-xs py-1 px-2 rounded shadow-lg whitespace-nowrap"
                                        >
                                            {new Date(task.completionDate).toLocaleTimeString("th-TH", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })} น.
                                        </span>
                                    </td>
                                    <td className="border border-gray-300 dark:border-gray-600  text-center align-middle">
                                        <span
                                            className={`${task.status === "pending"
                                                ? "text-yellow-600"
                                                : task.status === "in_progress"
                                                    ? "text-blue-600"
                                                    : task.status === "completed"
                                                        ? "text-green-600"
                                                        : task.status === "completed_Late"
                                                            ? "text-red-600"
                                                            : "text-gray-600"
                                                }`}
                                        >
                                            {task.status === "pending" && "รอดำเนินการ"}
                                            {task.status === "in_progress" && "กำลังดำเนินการ"}
                                            {task.status === "completed" && "เสร็จสิ้น"}
                                            {task.status === "completed_Late" && "เสร็จล่าช้า"}
                                        </span>
                                    </td>
                                    <td className="border border-gray-300 dark:border-gray-600 text-center align-middle">
                                        {task.processTime &&
                                            typeof task.processTime === "string" &&
                                            task.processTime.trim() !== "" &&
                                            task.processTime !== "No field"
                                            ? task.processTime
                                                .replace("ชั่วโมง", "ชม.") // แทนที่ "ชั่วโมง" ด้วย "ชม."
                                                .replace("นาที", "น.")     // แทนที่ "นาที" ด้วย "น."
                                            : ""}
                                    </td>

                                    <td className="border border-gray-300 dark:border-gray-600 text-center align-middle">
                                        <button
                                            className="px-2 py-1 bg-blue-500 text-white font-medium text-sm rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 transition-transform transform hover:scale-105"
                                            onClick={handleViewDetails} // ฟังก์ชันตัวอย่างเมื่อกดปุ่ม
                                        >
                                            ดู
                                        </button>
                                    </td>





                                </tr>
                            ))}

                        </tbody>

                    </table>

                    {/* Pagination */}
                    <div className="flex flex-col items-center space-y-2">
                        {/* Pagination Buttons */}
                        <div className="flex justify-center mt-4 space-x-2">
                            {(() => {
                                const totalPages = pagination.totalPages; // จำนวนหน้าทั้งหมด
                                const maxVisiblePages = 10; // จำนวนหน้าที่แสดงก่อนจุดไข่ปลา
                                const trailingPages = 3; // จำนวนหน้าที่แสดงหลังจุดไข่ปลา
                                const pages = [];

                                if (totalPages <= maxVisiblePages + trailingPages) {
                                    // กรณีที่จำนวนหน้าน้อยกว่าหรือเท่ากับ 10 + 3
                                    for (let i = 1; i <= totalPages; i++) {
                                        pages.push(i);
                                    }
                                } else {
                                    if (currentPage <= maxVisiblePages - 2) {
                                        // กรณีที่อยู่ในหน้าแรก ๆ
                                        for (let i = 1; i <= maxVisiblePages; i++) {
                                            pages.push(i);
                                        }
                                        pages.push("...");
                                        for (let i = totalPages - trailingPages + 1; i <= totalPages; i++) {
                                            pages.push(i);
                                        }
                                    } else if (currentPage > totalPages - trailingPages) {
                                        // กรณีที่อยู่ในหน้าสุดท้าย
                                        for (let i = 1; i <= 3; i++) {
                                            pages.push(i);
                                        }
                                        pages.push("...");
                                        for (let i = totalPages - maxVisiblePages + 1; i <= totalPages; i++) {
                                            pages.push(i);
                                        }
                                    } else {
                                        // กรณีที่อยู่ตรงกลาง
                                        for (let i = 1; i <= 3; i++) {
                                            pages.push(i);
                                        }
                                        pages.push("...");
                                        for (let i = currentPage - 4; i <= currentPage + 2; i++) {
                                            pages.push(i);
                                        }
                                        pages.push("...");
                                        for (let i = totalPages - trailingPages + 1; i <= totalPages; i++) {
                                            pages.push(i);
                                        }
                                    }
                                }

                                return pages.map((page, index) => (
                                    <button
                                        key={index}
                                        onClick={() => typeof page === "number" && handlePageChange(page)}
                                        style={{
                                            backgroundColor: currentPage === page
                                                ? getColorFromTheme(theme.primaryColor || "blue", theme.primaryWeight || "500")
                                                : getColorFromTheme(theme.secondaryColor || "gray", theme.secondaryWeight || "200"),
                                            color: currentPage === page ? "#ffffff" : "#000000",
                                            padding: "0.5rem 1rem",
                                            borderRadius: "0.375rem",
                                            cursor: page === "..." ? "not-allowed" : "pointer",
                                        }}
                                        disabled={page === "..."}>
                                        {page}
                                    </button>
                                ));
                            })()}
                        </div>

                        {/* Input for Jumping to Specific Page */}
                        {/* Conditional Input for Jumping to Specific Page */}
                        {pagination.totalPages > 50 && (
                            <div className="flex items-center space-x-2 mt-2 text-gray-900 dark:text-gray-100">
                                <span>ไปยังหน้า:</span>
                                <input
                                    type="number"
                                    min="1"
                                    max={pagination.totalPages}
                                    placeholder={`1 - ${pagination.totalPages}`}
                                    className="w-20 border border-gray-300 dark:border-gray-600 px-3 py-1 rounded-lg text-center bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            const page = Number(e.target.value);
                                            if (page >= 1 && page <= pagination.totalPages) {
                                                handlePageChange(page);
                                            }
                                        }
                                    }}
                                />
                            </div>
                        )}

                    </div>











                </div>
            )}

            {!loading && tasks.length === 0 && (
                <div className="mt-4 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="text-gray-400 dark:text-gray-500">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-16 w-16"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 17v-2a4 4 0 118 0v2m1 0h2a2 2 0 002-2v-5a2 2 0 00-2-2h-3.586a1 1 0 01-.707-.293l-1.414-1.414a1 1 0 00-.707-.293H9.414a1 1 0 00-.707.293L7.293 8.707A1 1 0 016.586 9H3a2 2 0 00-2 2v5a2 2 0 002 2h2m10 0v2m-4 0v2"
                            />
                        </svg>
                    </div>
                    <p className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                        ไม่มีข้อมูลที่จะแสดง
                    </p>
                    <button
                        onClick={fetchTasks} // ใส่ฟังก์ชันสำหรับโหลดใหม่ถ้ามี
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
                    >
                        โหลดข้อมูลอีกครั้ง
                    </button>
                </div>
            )}




            {/* Modal */}
            {isModalOpen && selectedTask && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-11/12 sm:w-2/3 lg:w-1/2">
                        {/* Header */}
                        <div className="flex justify-between items-center border-b border-gray-300 dark:border-gray-700 px-6 py-4">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                รายละเอียดงาน - {selectedTask.jobID}
                            </h2>
                            <button
                                className="text-gray-600 dark:text-gray-300 hover:text-red-500"
                                onClick={closeModal}
                            >
                                <FaTimes className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                {/* Left Column: Job Information */}
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold text-gray-800 dark:text-gray-200">ข้อมูลงาน</h3>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            <span className="font-semibold">ชื่ออุปกรณ์:</span> {selectedTask.computerName || "N/A"}
                                        </p>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            <span className="font-semibold">ประเภทงาน:</span> {selectedTask.category || "N/A"}
                                        </p>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            <span className="font-semibold">สถานที่:</span> {selectedTask.location || "N/A"}
                                        </p>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            <span className="font-semibold">สถานะ:</span> {selectedTask.status || "N/A"}
                                        </p>
                                    </div>
                                </div>

                                {/* Right Column: Reporter & Assignee */}
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold text-gray-800 dark:text-gray-200">ผู้แจ้ง</h3>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            <span className="font-semibold">ชื่อ:</span> {selectedTask.fullName || "N/A"}
                                        </p>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            <span className="font-semibold">ตำแหน่ง:</span> {selectedTask.position || "N/A"}
                                        </p>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            <span className="font-semibold">อีเมล:</span> {selectedTask.email || "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 dark:text-gray-200">ผู้รับงาน</h3>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            <span className="font-semibold">ชื่อ:</span> {selectedTask.nameJob_owner || "N/A"}
                                        </p>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            <span className="font-semibold">ชื่อเล่น:</span> {selectedTask.nicknameJob_owner || "N/A"}
                                        </p>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            <span className="font-semibold">เบอร์โทร:</span> {selectedTask.phoneJob_owner || "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Section */}
                            <div className="space-y-4 border-t border-gray-300 dark:border-gray-700 pt-4">
                                <div>
                                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">รายละเอียดการแก้ไข</h3>
                                    <p className="text-gray-700 dark:text-gray-300">{selectedTask.resolution_notes || "ไม่มีข้อมูล"}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">รายการอุปกรณ์ที่เปลี่ยน</h3>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        {selectedTask.device_change_info
                                            ? `อุปกรณ์เดิม: ${selectedTask.device_change_info.oldDevice || "N/A"} → อุปกรณ์ใหม่: ${selectedTask.device_change_info.newDevice || "N/A"}`
                                            : "ไม่มีการเปลี่ยนอุปกรณ์"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end border-t border-gray-300 dark:border-gray-700 px-6 py-4">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600"
                            >
                                ปิด
                            </button>
                        </div>
                    </div>
                </div>
            )}




        </div>
    );
};

export default AllTasksContent;