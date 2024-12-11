"use client";

import { useState, useEffect } from "react";
import { getColorFromTheme } from '@/utils/colorMapping';
import { useTheme } from "@/contexts/ThemeContext";
import { FaCheck } from "react-icons/fa";
import { FaTimes, FaMapMarkerAlt, FaUser, FaClock, FaCheckCircle } from "react-icons/fa";
import Calendar from "react-calendar";



import { useLoading } from "@/contexts/LoadingContext";


import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
import { Bar } from "react-chartjs-2";

// ลงทะเบียน components
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
    const { loading, showLoading, hideLoading } = useLoading();
    const [date, setDate] = useState(new Date());
    const [view, setView] = useState('month'); // กำหนดมุมมองเริ่มต้นเป็นเดือน

    const handleActiveStartDateChange = ({ activeStartDate, view }) => {
        setView(view); // อัปเดตมุมมองเมื่อเปลี่ยน
    };

    const handleHeaderClick = () => {
        if (view === "month") setView("year");
        else if (view === "year") setView("decade");
    };

    const chartData = {
        labels: ["01 Jan", "05 Jan", "10 Jan", "15 Jan", "20 Jan", "25 Jan"],
        datasets: [
            {
                label: "On Going",
                data: [20, 50, 70, 120, 200, 270],
                backgroundColor: "#3b82f6",
            },
            {
                label: "Finished",
                data: [10, 30, 50, 80, 100, 113],
                backgroundColor: "#10b981",
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
        },
    };







    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
            <h1 className="text-2xl font-bold mb-4">Hello, Carolyn Perkins!</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">You have 5 tasks on hand.</p>

            <div className="grid grid-cols-12 gap-6">
                {/* Task Overview */}
                <div className="col-span-8 bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Task Overview</h2>
                        <div className="flex space-x-2">
                            <button className="px-3 py-1 bg-gray-200 rounded">Monthly</button>
                            <button className="px-3 py-1 bg-gray-200 rounded">Weekly</button>
                            <button className="px-3 py-1 bg-gray-200 rounded">Daily</button>
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold text-blue-500 mb-4">383</h3>
                    <Bar data={chartData} options={chartOptions} />
                </div>

                {/* Calendar and Schedule */}
                {/* Calendar */}
                <div className="col-span-4 bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                    <Calendar
                        onChange={setDate}
                        value={date}
                        view={view}
                        onActiveStartDateChange={handleActiveStartDateChange}
                        tileClassName={({ date, view }) => {
                            if (
                                view === "month" &&
                                date.getDate() === new Date().getDate() &&
                                date.getMonth() === new Date().getMonth() &&
                                date.getFullYear() === new Date().getFullYear()
                            ) {
                                return "highlight-current-date";
                            }
                        }}
                        navigationLabel={({ date }) => {
                            // ใช้ <div> แทน <button>
                            return (
                                <div
                                    className="text-lg font-bold cursor-pointer"
                                    onClick={handleHeaderClick}
                                    role="button"
                                    tabIndex={0}
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter") handleHeaderClick();
                                    }}
                                >
                                    {view === "month"
                                        ? date.toLocaleString("default", {
                                            month: "long",
                                            year: "numeric",
                                        })
                                        : view === "year"
                                            ? date.getFullYear()
                                            : `${Math.floor(date.getFullYear() / 10) * 10} - ${Math.floor(date.getFullYear() / 10) * 10 + 9
                                            }`}
                                </div>
                            );
                        }}
                        next2Label={null}
                        prev2Label={null}
                        showNeighboringMonth={false}
                    />

                </div>
            </div>
        </div>
    );
};

export default DashboardContent;