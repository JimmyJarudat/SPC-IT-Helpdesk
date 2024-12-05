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
    const [sortOption, setSortOption] = useState("asc");
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
                    onChange={(date) => handleFilterChange({ target: { name: "startDate", value: date?.toISOString() } })}
                    placeholderText="📅 วันที่เริ่มต้น"
                    dateFormat="dd/MM/yyyy"
                    className="w-full border px-4 py-2 rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-600"
                />
                <DatePicker
                    selected={filters.endDate ? new Date(filters.endDate) : null}
                    onChange={(date) => handleFilterChange({ target: { name: "endDate", value: date?.toISOString() } })}
                    placeholderText="📅 วันที่สิ้นสุด"
                    dateFormat="dd/MM/yyyy"
                    className="w-full border px-4 py-2 rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-600"
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
                                <th className="border border-gray-300 px-4 py-2">ลำดับ</th>
                                <th className="border border-gray-300 px-4 py-2">เลขที่งาน</th>
                                <th className="border border-gray-300 px-4 py-2">ชื่องาน</th>
                                <th className="border border-gray-300 px-4 py-2">สถานะ</th>
                                <th className="border border-gray-300 px-4 py-2">วันที่สร้าง</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map((task, index) => (
                                <tr key={task.jobID}>
                                    {/* คำนวณลำดับโดยบวกกับ (currentPage - 1) * itemsPerPage */}
                                    <td className="border border-gray-300 px-4 py-2">
                                        {index + 1 + (currentPage - 1) * itemsPerPage}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">{task.jobID}</td>
                                    <td className="border border-gray-300 px-4 py-2">{task.jobName}</td>
                                    <td className="border border-gray-300 px-4 py-2">{task.status}</td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {new Date(task.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>

                    {/* Pagination */}
                    <div className="flex justify-center mt-4 space-x-2">
                        {Array.from({ length: pagination.totalPages }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => handlePageChange(i + 1)}
                                className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
                                    } hover:bg-blue-400`}
                            >
                                {i + 1}
                            </button>
                        ))}
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