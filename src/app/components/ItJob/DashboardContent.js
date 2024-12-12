// ใช้ client
"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Bar } from "react-chartjs-2";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

// ลงทะเบียน components ของ Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const DashboardContent = () => {
    const { theme } = useTheme();
    const [date, setDate] = useState(new Date());
    const [view, setView] = useState("month"); // มุมมองเริ่มต้นของปฏิทิน
    const [activeFilter, setActiveFilter] = useState("Monthly"); // ตัวเลือก Task Overview
    const [tasks, setTasks] = useState([]); // เก็บข้อมูลทั้งหมดที่ดึงมา
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });


    const adjustTimezone = (date) => {
        // แปลงวันที่ให้ตรงกับ UTC เพื่อป้องกันการย้อนวัน
        return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    };


    useEffect(() => {
        fetchData(); // ดึงข้อมูลเมื่อมีการเปลี่ยนตัวเลือกหรือตัววันที่
    }, [activeFilter, date]);

    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
    };

    const fetchData = async () => {
        let startDate, endDate;


        if (activeFilter === "Monthly") {
            startDate = new Date(date.getFullYear(), date.getMonth(), 1);
            endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        } else if (activeFilter === "Weekly") {
            endDate = adjustTimezone(new Date(date));
            startDate = adjustTimezone(new Date(date));
            startDate.setDate(startDate.getDate() - 6);
        } else if (activeFilter === "Daily") {
            startDate = adjustTimezone(new Date(date));
            endDate = adjustTimezone(new Date(date));
        }

        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);

        try {
            const response = await fetch(`/api/it-job/dashboard?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`);
            const result = await response.json();

            if (result.success) {
                setTasks(result.data); // เก็บข้อมูลทั้งหมด
                processChartData(result.data); // อัปเดต Chart
            } else {
                console.error(result.message);
            }
        } catch (error) {
            console.error("Error fetching jobs:", error);
        }
    };

    const processChartData = (jobs) => {
        const labels = [];
        const taskCounts = [];

        if (activeFilter === "Monthly") {
            const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
            const categoryCounts = {}; // เก็บข้อมูลแยกตามประเภท

            // เตรียม labels สำหรับแต่ละวัน
            for (let i = 1; i <= daysInMonth; i++) {
                const day = adjustTimezone(new Date(date.getFullYear(), date.getMonth(), i));
                const dayKey = day.toISOString().split("T")[0];
                labels.push(dayKey);
                categoryCounts[dayKey] = { device: 0, program: 0, user: 0, daily: 0 }; // เริ่มต้นค่า 0 สำหรับทุกประเภท
            }

            // เก็บจำนวนงานในแต่ละประเภท
            jobs.forEach((job) => {
                const jobDate = adjustTimezone(new Date(job.createdAt)).toISOString().split("T")[0];
                if (categoryCounts[jobDate]) {
                    const category = job.category?.toLowerCase();
                    if (categoryCounts[jobDate][category] !== undefined) {
                        categoryCounts[jobDate][category]++;
                    }
                }
            });

            // รวมจำนวนงานทั้งหมดของแต่ละวัน
            labels.forEach((label) => {
                const totalTasks =
                    categoryCounts[label].device +
                    categoryCounts[label].program +
                    categoryCounts[label].user +
                    categoryCounts[label].daily;
                taskCounts.push(totalTasks);
            });

            setChartData({
                labels,
                datasets: [
                    {
                        label: "Total Tasks",
                        data: taskCounts,
                        backgroundColor: "#3b82f6",
                        hoverBackgroundColor: "#2563eb",
                        // ปรับแต่ง Tooltip
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    const total = `📊 Total: ${context.raw}`;
                                    const categories = categoryCounts[context.label] || {
                                        device: 0,
                                        program: 0,
                                        user: 0,
                                        daily: 0,
                                    };
                                    return [
                                        total,
                                        `🖥️ Device: ${categories.device}`,
                                        `📂 Program: ${categories.program}`,
                                        `👤 User: ${categories.user}`,
                                        `📅 Daily: ${categories.daily}`,
                                    ];
                                },
                            },
                        },
                    },
                ],
            });

        }
        else if (activeFilter === "Weekly" || activeFilter === "Daily") {
            const categoryData = {
                device: [],
                program: [],
                user: [],
                daily: [],
                pm: [],
            };

            const days = activeFilter === "Daily" ? [new Date(date).toISOString().split("T")[0]] : Array.from({ length: 7 }, (_, i) => {
                const day = new Date(date);
                day.setDate(date.getDate() - (6 - i));
                return day.toISOString().split("T")[0];
            });

            days.forEach((day) => {
                labels.push(day);
                Object.keys(categoryData).forEach((key) => {
                    categoryData[key].push(0);
                });
            });

            jobs.forEach((job) => {
                const jobDate = new Date(job.createdAt).toISOString().split("T")[0];
                const index = labels.indexOf(jobDate);
                if (index !== -1 && job.category) {
                    const category = job.category.toLowerCase();
                    if (categoryData[category] !== undefined) {
                        categoryData[category][index]++;
                    }
                }
            });

            setChartData({
                labels,
                datasets: Object.keys(categoryData).map((key) => ({
                    label: key.charAt(0).toUpperCase() + key.slice(1),
                    data: categoryData[key],
                    backgroundColor: getColorForCategory(key),
                })),
            });
        }
    };

    const getColorForCategory = (category) => {
        const colors = {
            device: "#3b82f6",
            program: "#10b981",
            user: "#f59e0b",
            daily: "#ef4444",
        };
        return colors[category] || "#6b7280";
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
            <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                Hello, Carolyn Perkins!
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
                You have {tasks.length} tasks on hand.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Task Overview */}
                <div className="lg:col-span-9 bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                            Task Overview
                        </h2>
                        <div className="flex space-x-2">
                            {["Monthly", "Weekly", "Daily"].map((filter) => (
                                <button
                                    key={filter}
                                    className={`px-4 py-2 rounded-full font-medium transition-colors ${activeFilter === filter
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                                        }`}
                                    onClick={() => handleFilterChange(filter)}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold text-blue-500 mb-4">
                        {chartData.labels.length} Tasks
                    </h3>
                    {tasks.length > 0 ? (
                        <Bar data={chartData} options={{ responsive: true }} />
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center py-10 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-inner">
                            <p className="text-lg font-semibold text-gray-800 dark:text-white">
                                ไม่มีข้อมูลสำหรับวันที่{" "}
                                <span className="text-blue-500">
                                    {new Date(date).toLocaleDateString("th-TH", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </span>
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                                ขอโทษนะคะ ช่วงเวลานี้ไม่มีงาน ลองเลือกวันอื่นดูนะ 💖
                            </p>
                            <img
                                src="https://storage.googleapis.com/fastwork-static/fae2d28d-b539-46c6-a3d6-9a5774fdaa5a.jpg" // หรือ URL ของรูปที่ต้องการ
                                alt="No Data"
                                className="w-32 h-32 mt-4 rounded-md shadow-md"
                            />
                            <button
                                className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition-colors"
                                onClick={() => setDate(new Date())} // ตัวอย่าง: กดปุ่มเพื่อกลับไปวันที่ปัจจุบัน
                            >
                                กลับไปวันที่ปัจจุบัน
                            </button>
                        </div>
                    )}

                </div>

                {/* Calendar Section */}
                <div className="lg:col-span-3 bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                        Calendar
                    </h2>
                    <Calendar
                        onChange={(newDate) => {
                            setDate(adjustTimezone(new Date(newDate))); // แปลงวันที่ให้เป็น UTC
                        }}
                        value={date}
                        view={view} // ควบคุมมุมมอง (month/year/decade)
                        onActiveStartDateChange={({ activeStartDate }) => {
                            if (view === "year") {
                                // เมื่ออยู่ในมุมมองปี ให้เปลี่ยนวันที่เป็นวันที่ 1 มกราคมของปีนั้น
                                setDate(adjustTimezone(new Date(activeStartDate.getFullYear(), 0, 1)));
                                setView("month"); // กลับไปที่มุมมองเดือน
                            } else if (view === "month") {
                                setDate(adjustTimezone(new Date(activeStartDate))); // สำหรับเดือน
                            }
                        }}
                        navigationLabel={({ date, view }) => {
                            // กำหนด Navigation Bar ให้แสดงปีหรือเดือน
                            if (view === "month") {
                                return `${date.toLocaleString("default", { month: "long" })} ${date.getFullYear()}`;
                            } else if (view === "year") {
                                return `${date.getFullYear()}`;
                            } else if (view === "decade") {
                                const startDecade = Math.floor(date.getFullYear() / 10) * 10;
                                return `${startDecade} - ${startDecade + 9}`;
                            }
                        }}
                        onDrillDown={({ view }) => {
                            setView(view); // เปลี่ยนมุมมองเมื่อคลิก Drill Down (เช่น จาก Decade ไป Year)
                        }}
                        onDrillUp={() => {
                            // เปลี่ยนมุมมองเมื่อ Drill Up (เช่น จาก Year ไป Decade)
                            if (view === "month") {
                                setView("year");
                            } else if (view === "year") {
                                setView("decade");
                            }
                        }}
                        next2Label={null} // ซ่อนปุ่มเลื่อนปีหน้า
                        prev2Label={null} // ซ่อนปุ่มเลื่อนปีก่อนหน้า
                        tileClassName={({ date: tileDate }) => {
                            if (tileDate.toDateString() === new Date().toDateString()) {
                                return "bg-blue-500 text-white rounded-full";
                            }
                        }}
                        className="rounded-lg overflow-hidden"
                    />


                    {/* แสดงข้อมูลเวลา */}
                    <div className="mt-6 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                        <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                            Test Output (Date Range)
                        </h4>
                        <p className="text-gray-800 dark:text-gray-200">
                            <strong>Active Filter:</strong> {activeFilter}
                        </p>
                        <p className="text-gray-800 dark:text-gray-200">
                            <strong>Start Date:</strong> {chartData.labels[0] || "N/A"}
                        </p>
                        <p className="text-gray-800 dark:text-gray-200">
                            <strong>End Date:</strong> {chartData.labels[chartData.labels.length - 1] || "N/A"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardContent;