"use client";

import { useState, useEffect } from "react";
import { useSidebarContext } from "./SidebarContext";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { FaSearch, FaBell, FaCog, FaSignOutAlt, FaUser } from "react-icons/fa";
import Image from "next/image";
import SettingsDrawer from "./SettingsDrawer";
export default function Navbar() {
    const { toggleSidebar } = useSidebarContext();
    const { user, logout } = useUser();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);


    const router = useRouter();


    const toggleSettings = () => {
        setIsSettingsOpen((prev) => !prev);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };



    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    useEffect(() => {
        if (!user) {
            router.push("/login");
        }
    }, [user, router]);

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
                <button className="text-gray-600 hover:text-gray-800 focus:outline-none">
                    <FaSearch size={20} />
                </button>

                <div className="relative">
                    <button className="text-gray-600 hover:text-gray-800 focus:outline-none">
                        <FaBell size={20} />
                    </button>
                    <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                </div>

                {/* ไอคอนการตั้งค่า */}
                <div className="relative">
                    <button
                        onClick={toggleSettings}
                        className="text-gray-600 hover:text-gray-800 focus:outline-none"
                    >
                        <FaCog size={20} />
                    </button>
                    {isSettingsOpen && (
                        <SettingsDrawer
                            isOpen={isSettingsOpen}
                            onClose={() => setIsSettingsOpen(false)}
                        />
                    )}
                </div>

                {/* ข้อมูลผู้ใช้ */}
                <div className="relative">
                    <button
                        onClick={toggleDropdown}
                        className="flex items-center space-x-3 focus:outline-none"
                    >
                        <Image
                            src={user?.profileImage || "https://picsum.photos/200/300"}
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

                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                            <ul className="py-2">
                                <li>
                                    <button
                                        className="flex items-center px-4 py-2 w-full text-left text-gray-700 hover:bg-gray-100"
                                        onClick={() => router.push("/profile")}
                                    >
                                        <FaUser className="mr-2" /> Profile
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center px-4 py-2 w-full text-left text-gray-700 hover:bg-gray-100"
                                    >
                                        <FaSignOutAlt className="mr-2" /> Sign Out
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
