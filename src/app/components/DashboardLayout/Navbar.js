"use client";

import { useState, useEffect, useRef } from "react";
import { useSidebarContext } from "../../../contexts/SidebarContext";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { FaSearch, FaBell, FaCog, FaSignOutAlt, FaUser } from "react-icons/fa";
import Image from "next/image";
import SettingsDrawer from "./SettingsDrawer";
import DropdownMenu from "./DropdownMenuNav";

export default function Navbar() {
    const { user, logout, updateStatus } = useUser();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const dropdownRef = useRef(null); // ใช้สำหรับอ้างอิง Dropdown

    const { toggleSidebar, activeMenu } = useSidebarContext();
    const router = useRouter();

    const [formData, setFormData] = useState({
        fullName: "",
        nickName: "",
        email: "",
        phone: "",
        company: "",
        department: "",
        employeeID: "",
        profileImage: ""
    });


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);



    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch("/api/profile/profileupdate", {
                    method: "GET",
                });

                if (response.ok) {
                    const data = await response.json();
                    setFormData(data);

                    // ดึงรูปภาพ
                    if (data.profileImage) {
                        try {
                            const imageResponse = await fetch(data.profileImage, {
                                method: "GET",
                                headers: {
                                    username: data.username,
                                },
                            });

                            if (imageResponse.ok) {
                                const blob = await imageResponse.blob();
                                const imageUrl = URL.createObjectURL(blob);
                                setFormData((prev) => ({
                                    ...prev,
                                    profileImage: imageUrl,
                                }));
                            } else {
                                console.warn("Image not found, using placeholder.");
                                setFormData((prev) => ({
                                    ...prev,
                                    profileImage: "/files/profile-images/placeholder.png",
                                }));
                            }
                        } catch (error) {
                            console.error("Error fetching profile image:", error);
                        }
                    }
                } else {
                    console.error("Failed to fetch profile");
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };

        fetchProfile();
    }, [updateStatus]);





    const toggleSettings = () => {
        setIsSettingsOpen((prev) => !prev);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };



    const handleLogout = () => {
        logout();
        router.push("/");
    };

    useEffect(() => {
        if (!user) {
            router.push("/login");
        }
    }, [user, router]);

    return (

        <nav className="pr-[2%] h-16 bg-white-50 dark:bg-gray-900 shadow-md flex items-center justify-between px-4 flex-shrink-0 ">
            {/* ปุ่มเปิด/ปิด Sidebar และชื่อ Dashboard */}
            <div className="flex items-center space-x-4">
                <button
                    onClick={toggleSidebar}
                    className="text-xl text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white focus:outline-none"
                >
                    ☰
                </button>
                <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                    {activeMenu || "Dashboard"} {/* แสดงชื่อเมนูที่เลือก */}
                </h1>
            </div>

            {/* ส่วนขวาของ Navbar */}
            <div className="flex items-center space-x-6 relative">
                <button className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white focus:outline-none">
                    <FaSearch size={20} />
                </button>

                <div className="relative">
                    <button className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white focus:outline-none">
                        <FaBell size={20} />
                    </button>
                    <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 dark:bg-red-400 rounded-full border-2 border-white dark:border-gray-800"></span>
                </div>

                {/* ไอคอนการตั้งค่า */}
                <div className="relative">
                    <button
                        onClick={toggleSettings}
                        className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white focus:outline-none"
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
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={toggleDropdown}
                        className="flex items-center space-x-3 focus:outline-none"
                    >
                        <Image
                            src={formData.profileImage || "/placeholder.png"}
                            alt="User Avatar"
                            className="w-10 h-10 rounded-full"
                            width={100}  // อัตราส่วนที่ต้องการ
                            height={100} // อัตราส่วนที่ต้องการ
                            quality={100} // ตั้งค่าให้ความละเอียดสูงสุด
                        />
                        <div className="hidden sm:block">
                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                                {formData.fullName || "Guest"}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {user?.role || "Role"}
                            </p>
                        </div>
                    </button>

                    {isDropdownOpen && (
                        <DropdownMenu
                            isOpen={isDropdownOpen}
                            onClose={() => setIsDropdownOpen(false)}
                            handleLogout={handleLogout}
                        />
                    )}
                    

                </div>
            </div>
        </nav>

    );
}
