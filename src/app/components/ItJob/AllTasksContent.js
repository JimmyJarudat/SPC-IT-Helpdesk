"use client";

import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-calendar/dist/Calendar.css";



const AllTasksContent = () => {
    const [tasks, setTasks] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
    const [filters, setFilters] = useState({ startDate: "", endDate: "" });
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20; // จำนวนรายการต่อหน้า

    const [searchQuery, setSearchQuery] = useState("");
    const [sortOption, setSortOption] = useState("desc");
    const [totalFiltered, setTotalFiltered] = useState(0);





    const fetchTasks = async () => {
        setLoading(true);
        setTasks([]); // รีเซ็ต tasks ก่อนโหลดข้อมูลใหม่
        try {
            const params = new URLSearchParams({
                page: currentPage,
                limit: itemsPerPage,
                sort: sortOption,
                search: searchQuery,
                startDate: filters.startDate,
                endDate: filters.endDate,
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
            setLoading(false);
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
    }, [currentPage, filters]);



    const handlePageChange = (page) => {
        if (page > 0 && page <= pagination.totalPages) {
            setCurrentPage(page);
        }
    };




    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Completed Tasks</h1>

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
                    placeholder="🔍 ค้นหา (เช่น ชื่องาน, ผู้แจ้ง, ผู้รับ)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border px-4 py-2 rounded-lg w-full sm:w-1/3 focus:ring focus:ring-blue-300 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                />
                <DatePicker
                    selected={filters.startDate ? new Date(filters.startDate) : null}
                    onChange={(date) =>
                        handleFilterChange({
                            target: { name: "startDate", value: date?.toISOString() },
                        })
                    }
                    placeholderText="📅 วันที่เริ่มต้น"
                    dateFormat="dd/MM/yyyy"
                    className="w-full border px-4 py-2 rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    showYearDropdown // แสดง Dropdown เลือกปี
                    yearDropdownItemNumber={24} // จำนวนปีที่แสดง (เช่น 15 ปี)
                    scrollableYearDropdown // เพิ่มการเลื่อน Dropdown ปี
                />

                <DatePicker
                    selected={filters.endDate ? new Date(filters.endDate) : null}
                    onChange={(date) => handleFilterChange({ target: { name: "endDate", value: date?.toISOString() } })}
                    placeholderText="📅 วันที่สิ้นสุด"
                    dateFormat="dd/MM/yyyy"
                    className="w-full border px-4 py-2 rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    showYearDropdown // แสดง Dropdown เลือกปี
                    yearDropdownItemNumber={24} // จำนวนปีที่แสดง (เช่น 15 ปี)
                    scrollableYearDropdown // เพิ่มการเลื่อน Dropdown ปี
                />
                <select
                    // value={categoryFilter}
                    // onChange={(e) => setCategoryFilter(e.target.value)}
                    className="border px-4 py-2 rounded-lg w-full sm:w-1/4 focus:ring focus:ring-blue-300 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                >
                    <option value="">📦 ทั้งหมด</option>
                    <option value="hardware">💻 Hardware</option>
                    <option value="software">📱 Software</option>
                    <option value="network">🌐 Network</option>
                    <option value="user">👤 User</option>
                </select>
                <select
                    //value={statusFilter}
                    // onChange={(e) => setStatusFilter(e.target.value)}
                    className="border px-4 py-2 rounded-lg w-full sm:w-1/4 focus:ring focus:ring-blue-300 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                >
                    <option value="">📂 ทั้งหมด</option>
                    <option value="Completed">✅ Completed</option>
                    <option value="Completed Late">❌ Completed Late</option>
                    <option value="In Progress">🕒 In Progress</option>
                    <option value="Pending">⏳ Pending</option>
                </select>
                <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="border px-4 py-2 rounded-lg w-full sm:w-1/4 focus:ring focus:ring-blue-300 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                >
                    <option value="asc">🔼 เรียงจากน้อยไปมาก</option>
                    <option value="desc">🔽 เรียงจากมากไปน้อย</option>
                </select>
            </div>




            <button
                onClick={() => fetchTasks()}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                ค้นหา
            </button>

            {/* Loading */}
            {loading && <p className="mt-4">กำลังโหลดข้อมูล...</p>}

            {/* Tasks Table */}
            {!loading && tasks.length > 0 && (
                <div className="mt-6">
                    <table className="table-auto w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-300  py-2">ลำดับ</th>
                                <th className="border border-gray-300  py-2">เลขที่งาน</th>
                                <th className="border border-gray-300  py-2">ชื่องาน</th>
                                <th className="border border-gray-300  py-2">ประเภท</th>
                                <th className="border border-gray-300  py-2">วันที่แจ้ง</th>
                                <th className="border border-gray-300  py-2">ผู้แจ้ง</th>
                                <th className="border border-gray-300  py-2">เวลาที่เสร็จ</th>
                                <th className="border border-gray-300  py-2">สถานะ</th>
                                <th className="border border-gray-300  py-2">เวลาที่ใช้ทำงาน</th>
                                <th className="border border-gray-300  py-2">รายละเอียด</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map((task, index) => (

                                <tr key={task.jobID}>
                                    {/* คำนวณลำดับโดยบวกกับ (currentPage - 1) * itemsPerPage */}
                                    <td className="border border-gray-300  text-center align-middle">
                                        {index + 1 + (currentPage - 1) * itemsPerPage}
                                    </td>
                                    <td className="border border-gray-300  text-center align-middle">{task.jobID}</td>
                                    <td className="border border-gray-300 py-2 px-2">
                                        {task.jobName.length > 20 ? task.jobName.substring(0, 20) + "..." : task.jobName}
                                    </td>

                                    <td className="border border-gray-300  text-center align-middle">{task.category
                                    }</td>
                                    <td className="border border-gray-300  text-center align-middle">
                                        {new Date(task.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="border border-gray-300 px-4 text-center align-middle">{task.nickName}</td>
                                    <td className="border border-gray-300 px-4 text-center align-middle">
                                        {task.completionDate ? new Date(task.completionDate).toLocaleDateString() : null}
                                    </td>
                                    <td className="border border-gray-300  text-center align-middle">
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


                                    <td className="border border-gray-300 text-center align-middle">
                                        {task.processTime && typeof task.processTime === "string" && task.processTime.trim() !== "" && task.processTime !== "No field"
                                            ? task.processTime
                                            : ""}
                                    </td>




                                    <td className="border border-gray-300  text-center align-middle">
                                        <button>
                                            Click
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
                                        className={`px-3 py-1 rounded ${currentPage === page ? "bg-blue-500 text-white" : "bg-gray-200"
                                            } hover:bg-blue-400`}
                                        disabled={page === "..."}>
                                        {page}
                                    </button>
                                ));
                            })()}
                        </div>

                        {/* Input for Jumping to Specific Page */}
                        {/* Conditional Input for Jumping to Specific Page */}
                        {pagination.totalPages > 50 && (
                            <div className="flex items-center space-x-2 mt-2">
                                <span>ไปยังหน้า:</span>
                                <input
                                    type="number"
                                    min="1"
                                    max={pagination.totalPages}
                                    placeholder={`1 - ${pagination.totalPages}`}
                                    className="w-20 border px-3 py-1 rounded-lg text-center"
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








                    <div>
                        <h1>33</h1>
                    </div>


                </div>
            )}

            {!loading && tasks.length === 0 && (
                <p className="mt-4">ไม่มีข้อมูล</p>
            )}
        </div>
    );
};

export default AllTasksContent;