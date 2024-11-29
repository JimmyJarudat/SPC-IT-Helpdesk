"use client";

import { useState } from "react";
import { useSidebarContext } from "./SidebarContext";
import { useUser } from "../../context/UserContext";
import { useRouter } from "next/navigation";
import { FaSearch, FaBell, FaCog } from "react-icons/fa";
import Image from "next/image";

export default function Navbar() {
    const { toggleSidebar } = useSidebarContext();
    const { user, setUser } = useUser(); // ดึงข้อมูล user และ setUser จาก Context
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const router = useRouter();

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = () => {
        // ลบ token ออกจาก Local Storage
        localStorage.removeItem("token");

        // รีเซ็ตข้อมูลผู้ใช้ใน Context
        setUser(null);

        // นำทางไปยังหน้าล็อกอิน
        router.push("/login");
    };

    return (
        <nav className="h-16 bg-white shadow-md flex items-center justify-between px-4">
            {/* ปุ่มเปิด/ปิด Sidebar และชื่อ Dashboard */}
            <div className="flex items-center space-x-4">
                <button
                    onClick={toggleSidebar}
                    className="text-xl text-gray-600 hover:text-gray-800 focus:outline-none"
                >
                    ☰
                </button>
                <h1 className="text-lg font-bold text-gray-800">Dashboard</h1>
            </div>

            {/* ส่วนขวาของ Navbar */}
            <div className="flex items-center space-x-6 relative">
                {/* ไอคอนค้นหา */}
                <button className="text-gray-600 hover:text-gray-800 focus:outline-none">
                    <FaSearch size={20} />
                </button>

                {/* ไอคอนแจ้งเตือน */}
                <div className="relative">
                    <button className="text-gray-600 hover:text-gray-800 focus:outline-none">
                        <FaBell size={20} />
                    </button>
                    {/* จุดแดงแจ้งเตือน */}
                    <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                </div>

                {/* ไอคอนการตั้งค่า */}
                <button className="text-gray-600 hover:text-gray-800 focus:outline-none">
                    <FaCog size={20} />
                </button>

                {/* ข้อมูลผู้ใช้ */}
                <div className="relative">
                    <button
                        onClick={toggleDropdown}
                        className="flex items-center space-x-3 focus:outline-none"
                    >
                        <Image
                            src={user?.profileImage || "/path-to-default-avatar/avatar.png"}
                            alt="User Avatar"
                            className="w-8 h-8 rounded-full"
                            width={32}
                            height={32}
                        />
                        <div className="hidden sm:block">
                            <p className="text-sm font-semibold text-gray-800">{user?.fullName || "Guest"}</p>
                            <p className="text-xs text-gray-500">{user?.role || "Role"}</p>
                        </div>
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                            <ul className="py-2">
                                <li>
                                    <button className="flex items-center px-4 py-2 w-full text-left text-gray-700 hover:bg-gray-100">
                                        <FaSearch className="mr-2" /> Profile
                                    </button>
                                </li>
                                <li>
                                    <button className="flex items-center px-4 py-2 w-full text-left text-gray-700 hover:bg-gray-100">
                                        <FaCog className="mr-2" /> Account Settings
                                    </button>
                                </li>
                                <li>
                                    <button className="flex items-center px-4 py-2 w-full text-left text-gray-700 hover:bg-gray-100">
                                        <FaBell className="mr-2" /> Notifications
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={handleLogout} // เพิ่มฟังก์ชัน handleLogout
                                        className="flex items-center px-4 py-2 w-full text-left text-gray-700 hover:bg-gray-100"
                                    >
                                        Sign Out
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
