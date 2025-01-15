// ใช้ client
"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { getColorFromTheme } from '@/utils/colorMapping';
import { useLoading } from "@/contexts/LoadingContext";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar, Doughnut } from "react-chartjs-2";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { processChartData, chartOptions } from "./assetsDashboard/chartUtilsJob";
import { progressTime, chartOptionsTime } from "./assetsDashboard/chartProgressTime"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from "chart.js";

import { FaCalendarAlt, FaCalendarWeek, FaCalendarDay, FaCalendarCheck } from "react-icons/fa";
import { FaRegClock, FaTasks, FaUserFriends, FaBuilding } from "react-icons/fa";


// ลงทะเบียน components ของ Chart.js
ChartJS.register(ChartDataLabels);

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
);

const DashboardContent = () => {
    const { theme } = useTheme();
    const { loading, showLoading, hideLoading } = useLoading();
    const [isDarkMode, setIsDarkMode] = useState(false); // กำหนดโหมดเริ่มต้น
    const [date, setDate] = useState(new Date());
    const [view, setView] = useState("month"); // มุมมองเริ่มต้นของปฏิทิน
    const [activeFilter, setActiveFilter] = useState("Monthly"); // ตัวเลือก Task Overview
    const [tasks, setTasks] = useState([]); // เก็บข้อมูลทั้งหมดที่ดึงมา
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [comparisonData, setComparisonData] = useState(null);
    const [isCompareActive, setIsCompareActive] = useState(false);
    const [selectedType, setSelectedType] = useState(null);
    const [chartOptionJob, setChartOptionsJob] = useState();
    const [maxValue, setMaxValue] = useState();
    const [workHoursChartData, setWorkHoursChartData] = useState({ labels: [], datasets: [] });
    const [processedData, setProcessedData] = useState({});
    const [statusChartData, setStatusChartData] = useState({ labels: [], datasets: [] });
    const [categoryStatusCounts, setCategoryStatusCounts] = useState({});
    const [topDepartments, setTopDepartments] = useState([]);
    const [topIssues, setTopIssues] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState([]);
    const [modalTitle, setModalTitle] = useState("");
    const [allReporters, setAllReporters] = useState([]); // เก็บลำดับทั้งหมด
    const [topReporters, setTopReporters] = useState([]); // เก็บ 5 อันดับแรก
    const [allDepartments, setAllDepartments] = useState([]);
    const [allIssues, setAllIssues] = useState([]); // เก็บทุก Issues
    const [currentMonthIndex, setCurrentMonthIndex] = useState(0);

    // Activities Data
    const activitiesByMonth = [
        {
            month: "มกราคม",
            activities: [
                {
                    name: "กิจกรรม 1",
                    description: "ตัวอย่างรายละเอียดกิจกรรม 1 เดือนมกราคม",
                    saving: 199,
                },
                {
                    name: "กิจกรรม 2",
                    description: "ตัวอย่างรายละเอียดกิจกรรม 2 เดือนมกราคม",
                    saving: 2000,
                },
                {
                    name: "กิจกรรม 3",
                    description: "ตัวอย่างรายละเอียดกิจกรรม 3 เดือนมกราคม",
                    saving: 1200,
                },
            ],
        },
        {
            month: "กุมภาพันธ์",
            activities: [
                {
                    name: "กิจกรรม 1",
                    description: "ตัวอย่างรายละเอียดกิจกรรม 1 เดือนกุมภาพันธ์",
                    saving: 400,
                },
                {
                    name: "กิจกรรม 2",
                    description: "ตัวอย่างรายละเอียดกิจกรรม 2 เดือนกุมภาพันธ์",
                    saving: 199,
                },
                {
                    name: "กิจกรรม 3",
                    description: "ตัวอย่างรายละเอียดกิจกรรม 3 เดือนกุมภาพันธ์",
                    saving: 300,
                },
            ],
        },
        {
            month: "มีนาคม",
            activities: [
                {
                    name: "กิจกรรม 1",
                    description: "ตัวอย่างรายละเอียดกิจกรรม 1 เดือนมีนาคม",
                    saving: 400,
                },
                {
                    name: "กิจกรรม 2",
                    description: "ตัวอย่างรายละเอียดกิจกรรม 2 เดือนมีนาคม",
                    saving: 199,
                },
                {
                    name: "กิจกรรม 3",
                    description: "ตัวอย่างรายละเอียดกิจกรรม 3 เดือนมีนาคม",
                    saving: 400,
                },
            ],
        },
    ];

    // ฟังก์ชันเลื่อนเดือน
    const handlePreviousMonth = () => {
        setCurrentMonthIndex((prevIndex) => (prevIndex === 0 ? activitiesByMonth.length - 1 : prevIndex - 1));
    };

    const handleNextMonth = () => {
        setCurrentMonthIndex((prevIndex) => (prevIndex === activitiesByMonth.length - 1 ? 0 : prevIndex + 1));
    };

    const { month, activities } = activitiesByMonth[currentMonthIndex];


    // Summary Data
    const summaryData = [
        { month: "มกราคม", value: 4999 },
        { month: "กุมภาพันธ์", value: 899 },
        { month: "มีนาคม", value: 999 },
        { month: "เมษายน", value: 398 },
        { month: "พฤษภาคม", value: 199 },
        { month: "มิถุนายน", value: 500 },
        { month: "กรกฎาคม", value: 499 },
        { month: "สิงหาคม", value: 1148 },
        { month: "กันยายน", value: null },
        { month: "ตุลาคม", value: 900 },
        { month: "พฤศจิกายน", value: 1300 },
        { month: "ธันวาคม", value: null },
    ];

    // Calculate total saving
    const totalSaving = summaryData.reduce(
        (sum, item) => sum + (item.value || 0),
        0
    );




    const [selectedCategories, setSelectedCategories] = useState({
        Device: true,
        Program: true,
        User: true,
        Daily: true,
    });

    const handleViewAll = (title, data) => {
        setModalTitle(title);
        // สำหรับ Top Issues แยกข้อมูลตาม category
        if (title === "Top Issues") {
            setModalContent(data); // ส่งข้อมูล allIssues แบบเต็มที่ยังแยกตาม category อยู่
        } else {
            setModalContent(data); // สำหรับ View All อื่น ๆ ใช้ข้อมูลตรง
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const toggleCategoryVisibility = (category, isVisible) => {
        setSelectedCategories((prev) => {
            const updatedCategories = { ...prev, [category]: isVisible };

            // ประมวลผลข้อมูลใหม่สำหรับทั้งกราฟและตาราง
            const { chartData: updatedChartData, categoryData: updatedCategoryData } = progressTime(
                tasks,
                activeFilter,
                date,
                isDarkMode,
                adjustTimezone,
                updatedCategories
            );

            // อัปเดต state
            setWorkHoursChartData(updatedChartData);
            setProcessedData(updatedCategoryData); // อัปเดตข้อมูลสำหรับตาราง

            return updatedCategories;
        });
    };

    const adjustTimezone = (date) => {
        // แปลงวันที่ให้ตรงกับ UTC เพื่อป้องกันการย้อนวัน
        return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    };
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsDarkMode(theme.mode === "dark"); // เปลี่ยนเป็น theme.mode แทน theme
        }
    }, [theme]); // ตรวจสอบการเปลี่ยนแปลงของ theme

    useEffect(() => {
        fetchData(); // ดึงข้อมูลเมื่อมีการเปลี่ยนตัวเลือกหรือตัววันที่
    }, [activeFilter, date]);

    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
        setIsCompareActive(false);
    };

    const fetchData = async () => {
        showLoading();
        let startDate, endDate;

        // กำหนดช่วงเวลาตามตัวกรอง
        if (activeFilter === "Yearly") {
            startDate = new Date(date.getFullYear(), 0, 1); // 1 มกราคม
            endDate = new Date(date.getFullYear(), 11, 31); // 31 ธันวาคม
        } else if (activeFilter === "Monthly") {
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

        // ตั้งค่าช่วงเวลาให้ครบชั่วโมง
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);

        try {
            // ดึงข้อมูลจาก API
            const response = await fetch(`/api/it-job/dashboard?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`);
            const result = await response.json();

            if (result.success) {
                // เก็บข้อมูลงานทั้งหมดใน state
                setTasks(result.data);

                // ประมวลผลข้อมูลสำหรับกราฟแสดงประเภทงาน

                const data = processChartData(result.data, activeFilter, date, isDarkMode, adjustTimezone);
                const maxValue = Math.max(...data.datasets[0]?.data || [0]);
                setChartData(data);
                setChartOptionsJob(chartOptions(isDarkMode, maxValue));
                setMaxValue(maxValue);

                const { chartData, categoryStatusCounts } = processTaskStatus(result.data);
                setStatusChartData(chartData); // ตั้งค่าข้อมูลกราฟ
                setCategoryStatusCounts(categoryStatusCounts); // ตั้งค่าหมวดหมู่สถานะงาน

                // ประมวลผลข้อมูลสำหรับกราฟแสดงชั่วโมงทำงาน
                const { chartData: dataTime, categoryData } = progressTime(
                    result.data,
                    activeFilter,
                    date,
                    isDarkMode,
                    adjustTimezone,
                    selectedCategories
                );

                const allDepartmentsData = Object.entries(
                    result.data.reduce((acc, task) => {
                        const department = task.department || "Unknown";
                        acc[department] = (acc[department] || 0) + 1;
                        return acc;
                    }, {})
                ).map(([department, count]) => ({ department, count }))
                    .sort((a, b) => b.count - a.count); // จัดเรียงจากมากไปน้อย

                setAllDepartments(allDepartmentsData); // เก็บข้อมูลทั้งหมด
                setTopDepartments(allDepartmentsData.slice(0, 5)); // เก็บ 5 อันดับแรก

                // คำนวณผู้แจ้งทั้งหมด
                const allReportersData = Object.entries(
                    result.data.reduce((acc, task) => {
                        const reporter = task.fullName || task.nickName || "Unknown";
                        acc[reporter] = (acc[reporter] || 0) + 1;
                        return acc;
                    }, {})
                ).sort(([, a], [, b]) => b - a); // จัดเรียงจากมากไปน้อย

                setAllReporters(allReportersData); // เก็บข้อมูลทั้งหมด
                setTopReporters(allReportersData.slice(0, 5)); // เก็บ 5 อันดับแรก


                // ประมวลผลปัญหาทั้งหมด
                const categoryIssues = result.data.reduce((acc, task) => {
                    const category = task.category || "Uncategorized";
                    const tag = task.tag || "Unknown";

                    if (!acc[category]) acc[category] = {};
                    acc[category][tag] = (acc[category][tag] || 0) + 1;
                    return acc;
                }, {});

                const allIssuesData = Object.entries(categoryIssues).map(([category, issues]) => ({
                    category,
                    issues: Object.entries(issues)
                        .map(([title, count]) => ({ title, count }))
                        .sort((a, b) => b.count - a.count), // จัดเรียงจากมากไปน้อย
                }));

                const topIssuesData = allIssuesData.map(({ category, issues }) => ({
                    category,
                    issues: issues.slice(0, 5), // เอาแค่ 5 อันดับแรกต่อหมวดหมู่
                }));

                setAllIssues(allIssuesData); // เก็บข้อมูลทุก Issues
                setTopIssues(topIssuesData); // เก็บเฉพาะ Top 5          โ

                // คำนวณข้อมูลสำหรับ Top Reporters, Departments และ Issues
                const topReporters = calculateTopReporters(result.data);
                const topDepartments = calculateTopDepartments(result.data);
                const topIssues = calculateTopIssues(result.data);

                setTopReporters(topReporters);
                setTopDepartments(topDepartments);
                setTopIssues(topIssues);

                setWorkHoursChartData(dataTime);

                // เก็บข้อมูลสำหรับตารางประเภทงาน
                setProcessedData(categoryData);

            }
            else {
                console.error(result.message);
                setTasks([]); // ตั้งค่า tasks เป็นค่าว่าง
                setChartData({ labels: [], datasets: [] }); // ล้างกราฟ
                ser
            }
        } catch (error) {
            console.error("Error fetching jobs:", error);
            setTasks([]); // ตั้งค่า tasks เป็นค่าว่างเมื่อเกิดข้อผิดพลาด
            setChartData({ labels: [], datasets: [] }); // ล้างกราฟ
        } finally {
            hideLoading();
        }
    };

    const handleCompare = async () => {
        if (isCompareActive) {
            fetchData(); // รีเซ็ตกราฟกลับไปที่ข้อมูลเดิม
            setIsCompareActive(false);
            setComparisonData(null); // ล้างข้อมูลเปรียบเทียบ
            return;
        }

        let prevStartDate, prevEndDate;

        if (activeFilter === "Yearly") {
            prevStartDate = new Date(date.getFullYear() - 1, 0, 1);
            prevEndDate = new Date(date.getFullYear() - 1, 11, 31);
        } else if (activeFilter === "Monthly") {
            prevStartDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
            prevEndDate = new Date(date.getFullYear(), date.getMonth(), 0);
        }

        prevStartDate.setHours(0, 0, 0, 0);
        prevEndDate.setHours(23, 59, 59, 999);

        showLoading();
        try {
            const response = await fetch(
                `/api/it-job/dashboard?startDate=${prevStartDate.toISOString()}&endDate=${prevEndDate.toISOString()}`
            );
            const result = await response.json();

            if (result.success) {
                const comparisonProcessedData = processChartData(
                    result.data,
                    activeFilter,
                    prevStartDate,
                    isDarkMode,
                    adjustTimezone
                );

                setComparisonData(comparisonProcessedData); // อัปเดตข้อมูลเปรียบเทียบ
                const combinedData = {
                    labels: chartData.labels,
                    datasets: [
                        {
                            label: `Previous ${activeFilter}`,
                            data: comparisonProcessedData.datasets[0].data,
                            backgroundColor: "rgba(75, 192, 192, 0.5)", // สีสำหรับข้อมูลย้อนหลัง
                        },
                        ...chartData.datasets, // ข้อมูลปัจจุบันจะอยู่ด้านขวา
                    ],
                };

                setChartData(combinedData);
                setIsCompareActive(true);
            } else {
                console.error(result.message);
            }
        } catch (error) {
            console.error("Error fetching comparison data:", error);
        } finally {
            hideLoading();
        }
    };


    const processTaskStatus = (tasks) => {
        // สร้างออบเจ็กต์สำหรับเก็บจำนวนสถานะแบบเรียงลำดับ
        const statusOrder = ["pending", "in_progress", "completed", "completed_Late"];
        const statusColors = {
            pending: "#3B82F6", // สีฟ้า
            "in_progress": "#FBBF24", // สีเหลือง
            completed: "#10B981", // สีเขียว
            "completed_Late": "#EF4444", // สีแดง
        };

        const statusCounts = tasks.reduce((acc, task) => {
            const status = task.status || "Unknown"; // กำหนดสถานะ "Unknown" หากไม่มีค่า
            if (!acc[status]) {
                acc[status] = 0;
            }
            acc[status] += 1;
            return acc;
        }, {});

        // สร้าง categoryStatusCounts
        const categoryStatusCounts = tasks.reduce((acc, task) => {
            const category = task.category || "Uncategorized"; // หมวดหมู่ไม่มีค่าให้เป็น "Uncategorized"
            const status = task.status || "Unknown";
            if (!acc[category]) {
                acc[category] = {};
            }
            if (!acc[category][status]) {
                acc[category][status] = 0;
            }
            acc[category][status] += 1;
            return acc;
        }, {});

        // เตรียมข้อมูลสำหรับ Doughnut Chart
        const chartLabels = statusOrder.filter((status) => statusCounts[status]); // จัดเรียงสถานะตามลำดับที่กำหนด
        const chartDataValues = chartLabels.map((status) => statusCounts[status] || 0); // ดึงค่าของสถานะ
        const chartColors = chartLabels.map((status) => statusColors[status]); // จับคู่สีตามสถานะ

        const chartData = {
            labels: chartLabels,
            datasets: [
                {
                    label: "Task Status",
                    data: chartDataValues,
                    backgroundColor: chartColors,
                    borderWidth: 1,
                },
            ],
        };

        return { statusCounts, chartData, categoryStatusCounts };
    };

    // คำนวณ Top 5 Reporters
    const calculateTopReporters = (tasks) => {
        const reporterCounts = tasks.reduce((acc, task) => {
            const reporter = task.fullName || task.nickName || "Unknown"; // ใช้ fullname หรือ nickname
            acc[reporter] = (acc[reporter] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(reporterCounts)
            .sort(([, a], [, b]) => b - a) // จัดเรียงจากมากไปน้อย
            .slice(0, 5); // เอาแค่ 5 อันดับแรก
    };

    // คำนวณ Top 5 Departments
    const calculateTopDepartments = (tasks) => {
        const departmentCounts = tasks.reduce((acc, task) => {
            const department = task.department || "Unknown"; // ใช้ department
            acc[department] = (acc[department] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(departmentCounts)
            .map(([department, count]) => ({ department, count }))
            .sort((a, b) => b.count - a.count) // จัดเรียงจากมากไปน้อย
            .slice(0, 5); // เอาแค่ 5 อันดับแรก
    };

    // คำนวณ Top 5 Issues แยกตามประเภท
    const calculateTopIssues = (tasks) => {
        const categoryIssues = tasks.reduce((acc, task) => {
            const category = task.category || "Uncategorized";
            const tag = task.tag || "Unknown"; // ใช้ tag เป็นปัญหา

            if (!acc[category]) acc[category] = {};
            acc[category][tag] = (acc[category][tag] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(categoryIssues).map(([category, issues]) => ({
            category,
            issues: Object.entries(issues)
                .map(([title, count]) => ({ title, count }))
                .sort((a, b) => b.count - a.count) // จัดเรียงจากมากไปน้อย
                .slice(0, 5), // เอาแค่ 5 อันดับแรก
        }));
    };






    const thaiHolidays = [
        "2024-01-01", // วันขึ้นปีใหม่
        "2024-04-06", // วันจักรี
        "2024-04-13", // วันสงกรานต์
        "2024-04-14", // วันสงกรานต์
        "2024-04-15", // วันสงกรานต์
        "2024-05-01", // วันแรงงาน
        "2024-12-05", // วันพ่อแห่งชาติ
        "2025-01-01", // วันขึ้นปีใหม่
        "2025-02-19", // วันมาฆบูชา
        "2025-04-06", // วันจักรี
        "2025-04-13", // วันสงกรานต์
        "2025-04-14", // วันสงกรานต์
        "2025-04-15", // วันสงกรานต์
        "2025-05-01", // วันแรงงาน
        "2025-05-11", // วันวิสาขบูชา
        "2025-07-08", // วันอาสาฬหบูชา
        "2025-07-09", // วันเข้าพรรษา
        "2025-08-12", // วันแม่แห่งชาติ
        "2025-10-23", // วันปิยมหาราช
        "2025-12-05", // วันพ่อแห่งชาติ
        "2025-12-10", // วันรัฐธรรมนูญ
        "2025-12-31", // วันสิ้นปี
    ];


    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6" >
            <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                Hello, จิมมี่ใช่ไหม ไม่!!!   ห๊ะ ใช่แหละ!
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
                You have {tasks.length} tasks on hand.
            </p>




            {/** ตารางแรกกว่าจะพอใจ   */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Task Overview */}
                <div className="lg:col-span-9 bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                            Jobs Overview
                        </h2>
                        <div className="flex space-x-2">
                            {["Yearly", "Monthly", "Weekly", "Daily"].map((filter) => {
                                const icons = {
                                    Yearly: <FaCalendarAlt className="mr-2" />,
                                    Monthly: <FaCalendarCheck className="mr-2" />,
                                    Weekly: <FaCalendarWeek className="mr-2" />,
                                    Daily: <FaCalendarDay className="mr-2" />,
                                };

                                const isActive = activeFilter === filter;

                                const buttonStyle = {
                                    backgroundColor: isActive
                                        ? getColorFromTheme(theme.primaryColor, theme.primaryWeight)
                                        : "#E5E7EB",
                                    color: isActive ? "#FFFFFF" : "#1A202C",
                                    border: `2px solid ${isActive ? getColorFromTheme(theme.primaryColor, theme.primaryWeight) : "#E5E7EB"
                                        }`,
                                    transition: "all 0.3s ease",
                                };

                                const hoverStyle = {
                                    backgroundColor: isActive
                                        ? getColorFromTheme(theme.primaryColor, theme.primaryWeight)
                                        : "#BFDBFE",
                                    color: "#FFFFFF",
                                };

                                return (
                                    <button
                                        key={filter}
                                        style={{
                                            ...buttonStyle,
                                        }}
                                        className="flex items-center px-4 py-2 rounded-full font-medium"
                                        onMouseEnter={(e) => {
                                            e.target.style.backgroundColor = hoverStyle.backgroundColor;
                                            e.target.style.color = hoverStyle.color;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.backgroundColor = buttonStyle.backgroundColor;
                                            e.target.style.color = buttonStyle.color;
                                        }}
                                        onClick={() => handleFilterChange(filter)}
                                    >
                                        {icons[filter]}
                                        {filter}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* ปุ่มเปรียบเทียบ */}
                    <div className="flex justify-end mb-4">
                        {activeFilter === "Yearly" || activeFilter === "Monthly" ? (
                            <button
                                className={`flex items-center px-4 py-2 rounded-full font-medium transition-colors`}
                                style={{
                                    backgroundColor: isCompareActive
                                        ? getColorFromTheme(theme.primaryColor, theme.primaryWeight) // ใช้สีจากธีมเมื่อ active
                                        : "#E5E7EB", // สีพื้นหลังเมื่อ inactive
                                    color: isCompareActive ? "#FFFFFF" : "#1A202C", // สีข้อความตามสถานะ
                                    border: `2px solid ${isCompareActive ? getColorFromTheme(theme.primaryColor, theme.primaryWeight) : "#E5E7EB"}`, // ขอบปุ่ม
                                    transition: "all 0.3s ease",
                                }}
                                onMouseEnter={(e) => {
                                    if (!isCompareActive) {
                                        e.target.style.backgroundColor = "#BFDBFE"; // สี hover เมื่อ inactive
                                        e.target.style.color = "#FFFFFF";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isCompareActive) {
                                        e.target.style.backgroundColor = "#E5E7EB"; // กลับไปสีเดิมเมื่อ inactive
                                        e.target.style.color = "#1A202C";
                                    }
                                }}
                                onClick={handleCompare}
                            >
                                {activeFilter === "Yearly"
                                    ? isCompareActive
                                        ? "ยกเลิกเปรียบเทียบกับปีที่แล้ว"
                                        : "เปรียบเทียบกับปีที่แล้ว"
                                    : isCompareActive
                                        ? "ยกเลิกเปรียบเทียบกับเดือนเดียวกันของปีที่แล้ว"
                                        : "เปรียบเทียบกับเดือนเดียวกันของปีที่แล้ว"}
                            </button>
                        ) : null}
                    </div>


                    <h3 className="text-3xl font-bold text-blue-500 mb-4">
                        {tasks.length > 0 ? `${tasks.length} Jobs` : "No jobs available"}
                    </h3>

                    {tasks.length > 0 ? (
                        <Bar data={chartData} options={chartOptions(isDarkMode, maxValue)} />
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
                                src="https://storage.googleapis.com/fastwork-static/fae2d28d-b539-46c6-a3d6-9a5774fdaa5a.jpg"
                                alt="No Data"
                                className="w-32 h-32 mt-4 rounded-md shadow-md"
                            />
                            <button
                                className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition-colors"
                                onClick={() => setDate(new Date())}
                            >
                                กลับไปวันที่ปัจจุบัน
                            </button>
                        </div>
                    )}
                </div>


                {/* Calendar Section */}
                <div className="lg:col-span-3 bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 flex flex-col items-center">
                    {/* ส่วนหัว Calendar */}
                    <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white text-center">
                        Calendar
                    </h2>

                    {/* ปฏิทิน */}
                    <div className="w-full max-w-md mx-auto">
                        <Calendar
                            onChange={(newDate) => {
                                setDate(adjustTimezone(new Date(newDate))); // แปลงวันที่ให้เป็น UTC
                            }}
                            value={date}
                            view={view} // ควบคุมมุมมอง (month/year/decade)
                            onActiveStartDateChange={({ activeStartDate }) => {
                                if (view === "year") {
                                    setDate(adjustTimezone(new Date(activeStartDate.getFullYear(), 0, 1)));
                                    setView("month"); // กลับไปที่มุมมองเดือน
                                } else if (view === "month") {
                                    setDate(adjustTimezone(new Date(activeStartDate))); // สำหรับเดือน
                                }
                            }}
                            navigationLabel={({ date, view }) => {
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
                                setView(view);
                            }}
                            onDrillUp={() => {
                                if (view === "month") {
                                    setView("year");
                                } else if (view === "year") {
                                    setView("decade");
                                }
                            }}
                            next2Label={null} // ซ่อนปุ่มเลื่อนปีหน้า
                            prev2Label={null} // ซ่อนปุ่มเลื่อนปีก่อนหน้า

                            tileClassName={({ date }) => {
                                const adjustTimezone = (date) => {
                                    return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
                                };

                                const adjustedDate = adjustTimezone(date); // ปรับเวลาให้ตรงกับ Timezone
                                const formattedDate = adjustedDate.toISOString().split("T")[0]; // แปลงวันที่เป็น ISO String

                                if (thaiHolidays.includes(formattedDate)) {
                                    return "react-calendar__tile--thai-holiday"; // กำหนดคลาสสำหรับวันหยุดไทย
                                }

                                const day = adjustedDate.getDay(); // ดึงวันในสัปดาห์ (0=อาทิตย์, 6=เสาร์)
                                if (day === 0 || day === 6) {
                                    return "react-calendar__tile--weekend"; // กำหนดคลาสสำหรับวันหยุดสุดสัปดาห์
                                }

                                return null; // ไม่มีคลาสพิเศษสำหรับวันอื่น
                            }}

                            className={`react-calendar mx-auto ${isDarkMode ? "dark-mode" : "light-mode"}`}
                        />
                    </div>

                    {/* แสดงข้อมูลเวลา */}
                    <div className="mt-6 w-full max-w-md bg-gray-100 dark:bg-gray-700 p-6 rounded-lg">
                        <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-4 text-center">
                            Selected Date Range
                        </h4>
                        <div className="text-sm text-gray-800 dark:text-gray-200 space-y-2">
                            <p>
                                <span className="font-semibold">Filter Type:</span> {activeFilter}
                            </p>
                            <p>
                                <span className="font-semibold">From:</span>{" "}
                                {chartData?.labels?.[0]
                                    ? `${chartData.labels[0]} ${new Date().getFullYear()}`
                                    : "N/A"}
                            </p>
                            <p>
                                <span className="font-semibold">To:</span>{" "}
                                {chartData?.labels?.[chartData?.labels?.length - 1]
                                    ? `${chartData.labels[chartData.labels.length - 1]} ${new Date().getFullYear()}`
                                    : "N/A"}
                            </p>
                            {isCompareActive && comparisonData && (
                                <>
                                    <p>
                                        <span className="font-semibold">Comparison From:</span>{" "}
                                        {comparisonData?.labels?.[0]
                                            ? `${comparisonData.labels[0]} ${new Date().getFullYear() - 1}`
                                            : "N/A"}
                                    </p>
                                    <p>
                                        <span className="font-semibold">Comparison To:</span>{" "}
                                        {comparisonData?.labels?.[comparisonData?.labels?.length - 1]
                                            ? `${comparisonData.labels[comparisonData.labels.length - 1]} ${new Date().getFullYear() - 1
                                            }`
                                            : "N/A"}
                                    </p>
                                </>
                            )}
                        </div>
                    </div>

                </div>

            </div>

            
            {/*กราฟชั่วโมงทำงาน*/}
            {tasks.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
                {/* ตารางประเภทงาน */}
                <div className="col-span-1 lg:col-span-4 bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl p-6">
                    {/* Header */}
                    <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <span className="bg-blue-500 text-white p-2 rounded-full">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9.75 3.75l4.5 4.5m0 0l-4.5 4.5m4.5-4.5H4.5m10.5 0a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 19.5v-9a2.25 2.25 0 012.25-2.25"
                                />
                            </svg>
                        </span>
                        Task Types
                    </h2>

                    {/* Total Hours */}
                    <div className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 rounded-lg p-4 flex items-center justify-between shadow-md mb-6">
                        <div>
                            <h3 className="text-lg font-semibold">Total Hours</h3>
                            <p className="text-4xl font-extrabold">
                                {Object.values(processedData)
                                    .reduce((total, data) => total + data.totalHours, 0)
                                    .toFixed(2)}{" "}
                                <span className="text-lg font-light">ชั่วโมง</span>
                            </p>
                        </div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12 text-blue-300 dark:text-blue-200"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 10h11m0 0l4-4m-4 4l4 4m0-4H3m16 6.25a9 9 0 11-16.5 0 9 9 0 0116.5 0z"
                            />
                        </svg>
                    </div>


                    {/* Table     */}
                    <table className="w-full text-sm text-left border-collapse overflow-hidden rounded-lg">
                        <thead className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                            <tr>
                                <th className="py-4 px-6 font-bold">Category</th>
                                <th className="py-4 px-6 font-bold">Tasks</th>
                                <th className="py-4 px-6 font-bold">Hours</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                            {Object.entries(processedData).map(([type, data]) => (
                                <tr
                                    key={type}
                                    className={`cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-700 transition-all duration-200 ${selectedType === type ? "bg-blue-50 dark:bg-blue-800" : ""
                                        }`}
                                    onClick={() => setSelectedType(type)}
                                >
                                    <td className="py-4 px-6">{type}</td>
                                    <td className="py-4 px-6">{data.taskCount}</td>
                                    <td className="py-4 px-6">
                                        {Math.floor(data.totalHours)} ชม.{" "}
                                        {Math.round((data.totalHours % 1) * 60)} นาที
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-bold">
                            <tr>
                                <td className="py-4 px-6">Total</td>
                                <td className="py-4 px-6">
                                    {Object.values(processedData).reduce((sum, data) => sum + data.taskCount, 0)}
                                </td>
                                <td className="py-4 px-6">
                                    {Math.floor(
                                        Object.values(processedData).reduce((sum, data) => sum + data.totalHours, 0)
                                    )}{" "}
                                    ชม.{" "}
                                    {Math.round(
                                        (Object.values(processedData).reduce((sum, data) => sum + data.totalHours, 0) %
                                            1) *
                                        60
                                    )}{" "}
                                    นาที
                                </td>
                            </tr>
                        </tfoot>
                    </table>



                </div>



                {/* กราฟ */}
                <div className="col-span-1 lg:col-span-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col">
                    {/* Filter Categories */}
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                            Filter Categories
                        </h2>
                        <div className="flex flex-wrap space-x-4">
                            {['Device', 'Program', 'User', 'Daily'].map((category) => (
                                <label key={category} className="inline-flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        className="form-checkbox h-4 w-4 text-blue-600"
                                        defaultChecked
                                        onChange={(e) => toggleCategoryVisibility(category, e.target.checked)}
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{category}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Graph */}
                    <div className="flex-1 mt-6 w-full h-full px-4 lg:px-10">
                        {workHoursChartData?.datasets?.length > 0 ? (
                            <div className="w-full h-full">
                                <Bar data={workHoursChartData} options={chartOptionsTime(isDarkMode)} />
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 dark:text-gray-400">
                                No data available for the selected period.
                            </p>
                        )}
                    </div>
                </div>
            </div>
            )}

            {/* กราฟสถานะ */}
            {tasks.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
                {/* Task Status Overview */}
                <div className="col-span-1 lg:col-span-6 bg-gradient-to-r from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl p-6 relative flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between">
                            <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white mb-4 flex items-center gap-3">
                                <span className="p-2 rounded-full bg-blue-500 text-white">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M3 10h11m0 0l4-4m-4 4l4 4m-4-4H3m16 6.25a9 9 0 11-16.5 0 9 9 0 0116.5 0z"
                                        />
                                    </svg>
                                </span>
                                Task Status Overview
                            </h2>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                            Visualize the distribution of tasks by status for the selected period.
                        </p>
                    </div>
                    <div className="relative h-96 flex-1">
                        {statusChartData?.datasets?.length > 0 ? (
                            <Doughnut
                                data={statusChartData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: "bottom",
                                            labels: {
                                                color: isDarkMode ? "#e2e8f0" : "#1a202c",
                                                usePointStyle: true,
                                                boxWidth: 10,
                                            },
                                        },
                                        tooltip: {
                                            enabled: true,
                                            bodyColor: isDarkMode ? "#e2e8f0" : "#1a202c",
                                            titleColor: isDarkMode ? "#e2e8f0" : "#1a202c",
                                            backgroundColor: isDarkMode ? "#374151" : "#ffffff",
                                        },
                                    },
                                }}
                            />
                        ) : (
                            <p className="text-gray-500 text-center">No data available for the selected period.</p>
                        )}
                    </div>
                </div>

                {/* Status by Category */}
                <div className="col-span-1 lg:col-span-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-2xl p-6 overflow-hidden">
                    <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                        <span className="p-2 rounded-full bg-green-500 text-white shadow-md">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9.75 3.75l4.5 4.5m0 0l-4.5 4.5m4.5-4.5H4.5m10.5 0a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 19.5v-9a2.25 2.25 0 012.25-2.25"
                                />
                            </svg>
                        </span>
                        Status by Category
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-auto max-h-96">
                        {Object.entries(categoryStatusCounts).map(([category, statuses]) => (
                            <div
                                key={category}
                                className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-md hover:shadow-xl transition-all"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <p className="text-lg font-bold text-gray-800 dark:text-white capitalize">
                                        {category}
                                    </p>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {Object.values(statuses).reduce((sum, count) => sum + count, 0)} tasks
                                    </span>
                                </div>
                                <ul className="space-y-2">
                                    {Object.entries(statuses).map(([status, count]) => (
                                        <li
                                            key={status}
                                            className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 rounded-md px-4 py-2"
                                        >
                                            <span className="flex items-center gap-2">
                                                <span
                                                    className={`w-3 h-3 rounded-full ${status === "pending"
                                                        ? "bg-blue-500"
                                                        : status === "in_progress"
                                                            ? "bg-yellow-400"
                                                            : status === "completed"
                                                                ? "bg-green-500"
                                                                : status === "completed_Late"
                                                                    ? "bg-red-500"
                                                                    : "bg-gray-400"
                                                        }`}
                                                ></span>
                                                <span className="text-gray-700 dark:text-gray-300 capitalize">{status}</span>
                                            </span>
                                            <span className="font-bold text-gray-800 dark:text-white">{count} tasks</span>
                                        </li>
                                    ))}
                                </ul>

                            </div>
                        ))}
                    </div>

                </div>
            </div>
            )}


            {/* Top Reporters */}
            {tasks.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                {/* Top Reporters */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white flex items-center gap-3">
                            <span className="p-3 rounded-full bg-orange-500 text-white shadow-md">
                                <FaUserFriends className="h-7 w-7" />
                            </span>
                            Top Reporters
                        </h2>
                        <button
                            className="text-sm text-blue-500 hover:underline"
                            onClick={() => handleViewAll("Top Reporters", allReporters)}
                        >
                            View All
                        </button>
                    </div>
                    <ul className="space-y-3 max-h-96 overflow-y-auto">
                        {topReporters.map(([reporter, count], index) => (
                            <li key={index} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 rounded-md px-4 py-3 shadow-sm">
                                <span className="text-gray-800 dark:text-gray-300">{index + 1}. {reporter}</span>
                                <span className="font-bold text-gray-800 dark:text-white">{count} tasks</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Top 5 Departments */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white flex items-center gap-3">
                            <span className="p-3 rounded-full bg-blue-500 text-white shadow-md">
                                <FaBuilding className="h-7 w-7" />
                            </span>
                            Top 5 Departments
                        </h2>
                        <button
                            className="text-sm text-blue-500 hover:underline"
                            onClick={() =>
                                handleViewAll(
                                    "Top Departments",
                                    allDepartments.map(({ department, count }) => [department, count])
                                )
                            }
                        >
                            View All
                        </button>

                    </div>
                    <ul className="space-y-3 max-h-96 overflow-y-auto">
                        {topDepartments.map(({ department, count }, index) => (
                            <li
                                key={department}
                                className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 rounded-md px-4 py-3 shadow-sm"
                            >
                                <span className="text-gray-800 dark:text-gray-300">{index + 1}. {department}</span>
                                <span className="font-bold text-gray-800 dark:text-white">{count} tasks</span>
                            </li>
                        ))}
                    </ul>
                </div>


                {/* Top 5 Issues */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white flex items-center gap-3">
                            <span className="p-3 rounded-full bg-green-500 text-white shadow-md">
                                <FaTasks className="h-7 w-7" />
                            </span>
                            Top 5 Issues
                        </h2>
                        <button
                            className="text-sm text-blue-500 hover:underline"
                            onClick={() => handleViewAll("Top Issues", allIssues)}
                        >
                            View All
                        </button>
                    </div>


                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {topIssues.map(({ category, issues }) => (
                            <div key={category} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-sm">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-lg font-bold text-gray-800 dark:text-white capitalize">{category}</p>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">{issues.reduce((total, issue) => total + issue.count, 0)} tasks</span>
                                </div>
                                <ul className="space-y-2">
                                    {issues.map((issue) => (
                                        <li
                                            key={issue.title}
                                            className="flex justify-between items-center text-sm bg-gray-100 dark:bg-gray-800 rounded-md px-4 py-2 shadow-sm"
                                        >
                                            <span className="text-gray-800 dark:text-gray-300">{issue.title}</span>
                                            <span className="font-bold text-gray-800 dark:text-white">{issue.count} tasks</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 max-h-[80%] overflow-auto">
                        {/* Header */}
                        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700 bg-gray-100 dark:bg-gray-900 rounded-t-lg">
                            <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                                {modalTitle}
                            </h2>
                            <button
                                className="text-gray-500 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition duration-300"
                                onClick={handleCloseModal}
                            >
                                ✕
                            </button>
                        </div>
                        {/* Content */}
                        <div className="p-4">
                            {modalTitle === "Top Issues" ? (
                                modalContent.map(({ category, issues }) => (
                                    <div
                                        key={category}
                                        className="bg-gray-50 dark:bg-gray-800 rounded-md p-4 shadow-sm mb-4"
                                    >
                                        {/* Category Header */}
                                        <div className="flex justify-between items-center mb-2">
                                            <p className="text-base font-semibold text-gray-800 dark:text-white capitalize">
                                                {category}
                                            </p>
                                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                {issues.reduce(
                                                    (total, issue) => total + issue.count,
                                                    0
                                                )}{" "}
                                                tasks
                                            </span>
                                        </div>
                                        {/* Issues List */}
                                        <ul className="space-y-1">
                                            {issues.map(({ title, count }, index) => (
                                                <li
                                                    key={title}
                                                    className="flex justify-between items-center text-sm bg-gray-100 dark:bg-gray-700 rounded px-3 py-2 shadow-sm"
                                                >
                                                    <span className="text-gray-800 dark:text-gray-300">
                                                        {index + 1}. {title}
                                                    </span>
                                                    <span className="font-medium text-gray-800 dark:text-white">
                                                        {count} tasks
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))
                            ) : (
                                <ul className="space-y-1">
                                    {modalContent.map(([name, count], index) => (
                                        <li
                                            key={index}
                                            className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 rounded px-3 py-2 shadow-sm"
                                        >
                                            <span className="text-gray-800 dark:text-gray-300">
                                                {index + 1}. {name}
                                            </span>
                                            <span className="font-medium text-gray-800 dark:text-white">
                                                {count} tasks
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                {/* สรุปยอดสะสม (ด้านซ้าย) */}
                <div className="col-span-1 bg-gradient-to-r from-green-100 to-green-50 dark:from-gray-800 dark:to-gray-700 rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white mb-6 text-center">
                        สรุปยอดสะสมกิจกรรมลดต้นทุน
                    </h2>
                    <ul className="divide-y divide-gray-300 dark:divide-gray-700">
                        {summaryData.map(({ month, value }, index) => (
                            <li
                                key={index}
                                className="flex justify-between items-center py-4 px-4 hover:bg-green-200 dark:hover:bg-gray-600 transition-all rounded-md"
                            >
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {month}
                                </span>
                                <span className="text-lg font-bold text-green-700 dark:text-green-400">
                                    {value || "-"} บาท
                                </span>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-6 bg-green-200 dark:bg-green-700 text-green-800 dark:text-green-200 p-4 rounded-lg shadow-inner text-center">
                        <p className="text-lg font-extrabold">
                            รวมทั้งหมด:{" "}
                            <span className="text-xl text-green-900 dark:text-green-300">
                                {totalSaving} บาท
                            </span>
                        </p>
                    </div>
                </div>

                {/* กิจกรรมลดต้นทุน (ด้านขวา) */}
                <div className="col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white mb-6 text-center">
                        กิจกรรมลดต้นทุนรายเดือน
                    </h2>

                    {/* ตัวเลือกเดือน */}
                    <div className="flex justify-between items-center mb-6">
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition-all"
                            onClick={handlePreviousMonth}
                        >
                            ◀ เดือนก่อนหน้า
                        </button>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                            {month}
                        </h3>
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition-all"
                            onClick={handleNextMonth}
                        >
                            เดือนถัดไป ▶
                        </button>
                    </div>

                    {/* กิจกรรมลดต้นทุน */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 shadow-inner">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-t-lg">
                                    <th className="py-4 px-6 text-sm font-semibold">ลำดับ</th>
                                    <th className="py-4 px-6 text-sm font-semibold">ชื่อกิจกรรม</th>
                                    <th className="py-4 px-6 text-sm font-semibold">รายละเอียด</th>
                                    <th className="py-4 px-6 text-sm font-semibold">ลดต้นทุน</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activities.map((activity, idx) => (
                                    <tr
                                        key={idx}
                                        className={`border-t ${idx % 2 === 0
                                            ? "bg-gray-50 dark:bg-gray-800"
                                            : "bg-white dark:bg-gray-900"
                                            } hover:bg-blue-100 dark:hover:bg-blue-700 transition-all`}
                                    >
                                        <td className="py-4 px-6 text-sm text-gray-800 dark:text-gray-200">
                                            {idx + 1}
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-800 dark:text-gray-200 font-bold">
                                            {activity.name}
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">
                                            {activity.description}
                                        </td>
                                        <td className="py-4 px-6 text-sm text-green-600 dark:text-green-400 font-bold">
                                            {activity.saving} บาท
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>











        </div >
    );
};

export default DashboardContent;