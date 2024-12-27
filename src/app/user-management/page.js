"use client";

import { useEffect, useState } from "react";
import { FaUser, FaKey, FaLock, FaUserTag, FaCamera, FaEnvelope, FaPhone, FaBuilding, FaIdBadge } from "react-icons/fa";
import { MdDelete, MdOutlineLockReset } from "react-icons/md";
import { FaUserPlus } from 'react-icons/fa';
import { FaUserEdit } from "react-icons/fa";
import { useTheme } from "../../contexts/ThemeContext";
import { getColorFromTheme } from '../../utils/colorMapping'
import { useUser } from "@/contexts/UserContext";
import { useLoading } from "@/contexts/LoadingContext";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";




export default function ProfilePage() {
    const { user, setUpdateStatus } = useUser();
    const { theme } = useTheme();
    const { showLoading, hideLoading } = useLoading();
    const [images, setImages] = useState([]);
    const [activeTab, setActiveTab] = useState("User List");
    const [isModalUpdat, setIsModalUpdate] = useState(false);
    const [isModalDelete, setIsModalDelete] = useState(false);
    const [isModalResetpassword, setIsModalResetpassword] = useState(false);
    const [isModalAddUser, setIsModalAddUser] = useState(false);

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");


    const [users, setUsers] = useState([]);
    const [updatedUser, setUpdatedUser] = useState(null); // ใช้เก็บข้อมูลที่อัปเดต
    const [newUserData, setNewUserData] = useState({
        userId: '',         // User ID
        fullName: '',       // Full name
        username: '',       // Username
        password: '',       // Password
        role: 'user',       // User role (user, admin, superadmin)
        role_status: 'pending', // Role status (pending, approved, rejected)
        company: '',        // Company
        department: '',     // Department
        email: '',          // Email
        employeeID: '',     // Employee ID
        nickName: '',       // Nickname
        phone: '',          // Phone number
        profileImage: '',   // Profile image URL
        computerName: '',   // Computer name
        position: '',       // Position
        division: '',       // Division
        location: '',       // Location
    });
    const [addUser, setAddUser] = useState({
        userId: '',         // User ID
        fullName: '',       // Full name
        username: '',       // Username
        password: '',       // Password
        role: 'user',       // User role (user, admin, superadmin)
        role_status: 'pending', // Role status (pending, approved, rejected)
        company: '',        // Company
        department: '',     // Department
        email: '',          // Email
        employeeID: '',     // Employee ID
        nickName: '',       // Nickname
        phone: '',          // Phone number
        profileImage: '',   // Profile image URL
        computerName: '',   // Computer name
        position: '',       // Position
        division: '',       // Division
        location: '',       // Location
    });


    const fetchUser = async () => {
        try {
            const response = await fetch("/api/userManagement/getuser", {
                method: "POST",
            });
            const data = await response.json();

            if (response.ok) {

                if (Array.isArray(data.data)) {
                    setUsers(data.data);
                } else {
                    console.error('ข้อมูลไม่ใช่อาร์เรย์');
                }
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            // ทำการดำเนินการอื่นๆ หากต้องการ
        }
    };


    const updateUser = async () => {
        const response = await fetch("/api/userManagement/updateuser", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: newUserData.userId,         // ส่ง User ID
                fullName: newUserData.fullName,     // ส่ง Full Name
                username: newUserData.username,     // ส่ง Username
                password: newUserData.password,     // ส่ง Password
                role: newUserData.role,             // ส่ง Role (user, admin, superadmin)
                role_status: newUserData.role_status, // ส่ง Role Status (pending, approved, rejected)
                company: newUserData.company,       // ส่ง Company
                department: newUserData.department, // ส่ง Department
                email: newUserData.email,           // ส่ง Email
                employeeID: newUserData.employeeID, // ส่ง Employee ID
                nickName: newUserData.nickName,     // ส่ง Nickname
                phone: newUserData.phone,           // ส่ง Phone number
                profileImage: newUserData.profileImage, // ส่ง Profile Image URL
                computerName: newUserData.computerName, // ส่ง Computer Name
                position: newUserData.position,     // ส่ง Position
                division: newUserData.division,     // ส่ง Division
                location: newUserData.location,     // ส่ง Location
            }),

        });

        const data = await response.json();
        if (response.ok) {
            // อัปเดตข้อมูลสำเร็จ
            fetchUser();
            toast.success("Profile updated successfully!");
            setIsModalUpdate(false);
        } else {
            console.error("อัปเดตล้มเหลว", data.message);
            toast.error("An unexpected error occurred.");
        }
    };
    // Use useEffect to call fetchUser when the component mounts
    useEffect(() => {
        fetchUser();
    }, []);

    const handleEdit = (userM) => {
        // กำหนดข้อมูลผู้ใช้ที่ต้องการอัปเดตลงใน state
        setUpdatedUser(userM);
        setNewUserData({
            userId: userM._id,                  // กำหนด userId จาก _id
            fullName: userM.fullName || '',      // กำหนด Full Name (หากไม่มีค่าให้เป็น '')
            username: userM.username || '',      // กำหนด Username (หากไม่มีค่าให้เป็น '')
            password: userM.password || '',      // กำหนด Password (หากไม่มีค่าให้เป็น '')
            role: userM.role || 'user',          // กำหนด Role (ค่าเริ่มต้นคือ 'user')
            role_status: userM.role_status || 'pending', // กำหนด Role Status (ค่าเริ่มต้นคือ 'pending')
            company: userM.company || '',        // กำหนด Company
            department: userM.department || '',  // กำหนด Department
            email: userM.email || '',            // กำหนด Email
            employeeID: userM.employeeID || '',  // กำหนด Employee ID
            nickName: userM.nickName || '',      // กำหนด Nickname
            phone: userM.phone || '',            // กำหนด Phone number
            profileImage: userM.profileImage || '', // กำหนด Profile Image URL
            computerName: userM.computerName || '', // กำหนด Computer Name
            position: userM.position || '',      // กำหนด Position
            division: userM.division || '',      // กำหนด Division
            location: userM.location || '',      // กำหนด Location
        });

        setIsModalUpdate(true);
    };


    const handleResetPassword = (userM) => {
        setNewUserData({
            userId: userM._id,
            fullName: userM.fullName,
            username: userM.username,
        });

        // เปิด modal สำหรับการรีเซ็ตรหัสผ่าน
        setIsModalResetpassword(true);
    };

    const handleDelete = (userM) => {
        setNewUserData({
            userId: userM._id,
            fullName: userM.fullName,
            username: userM.username,
            nickName: userM.nickName,

        });
        setIsModalDelete(true);
    };

    const DeleteUser = async () => {
        try {
            const response = await fetch("/api/userManagement/updateuser", {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: newUserData.userId, }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('User deleted successfully');
                fetchUser(); // refresh ข้อมูลหลังลบสำเร็จ
            } else {
                toast.error(data.message || 'Failed to delete user');
            }
        } catch (err) {
            console.error(err);
            toast.error('An error occurred');
        } finally {
            closeModal();
        }
    };

    // ฟังก์ชันสำหรับรีเซ็ตรหัสผ่าน
    const ResetPassword = async () => {
        // ตรวจสอบความตรงกันของรหัสผ่าน
        if (newPassword !== confirmPassword) {
            setErrorMessage("รหัสผ่านไม่ตรงกัน");
            return;
        }

        // ส่งข้อมูลไปที่ API
        try {
            const response = await fetch("/api/userManagement/updateuser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: newUserData.userId,  // ใช้ userId จาก newUserData
                    newPassword,
                }),
            });

            const result = await response.json();

            if (result.success) {
                setSuccessMessage("รีเซ็ตรหัสผ่านสำเร็จ!");
                setNewPassword("");
                setConfirmPassword("");
                toast.success("reset password successfully!");
                closeModalResetpaassword();
            } else {
                setErrorMessage(result.message || "เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน");
                toast.error("An unexpected error occurred.");
            }
        } catch (error) {
            setErrorMessage("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
        }
    };
    const handleAddUser = () => {
        setAddUser({
            userId: '',
            fullName: '',
            username: '',
            password: '',
            role: 'user',
            role_status: 'pending',
            company: '',
            department: '',
            email: '',
            employeeID: '',
            nickName: '',
            phone: '',
            profileImage: '',
            computerName: '',
            position: '',
            division: '',
            location: '',

        });
        setIsModalAddUser(true);
    };

    const AddUser = async () => {
        // Validate required fields
        if (!addUser.username || !addUser.password) {
            toast.error("กรุณากรอกข้อมูลที่จำเป็น (Username, Password, Email)");
            return;
        }

        // Validate password length
        if (addUser.password.length < 6) {
            toast.error("รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร");
            return;
        }

        try {
            showLoading(); // แสดง loading state

            const response = await fetch("/api/userManagement/updateuser", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: addUser.username,
                    password: addUser.password,
                    email: addUser.email,
                    fullName: addUser.fullName,
                    role: addUser.role,
                    role_status: addUser.role_status,
                    company: addUser.company,
                    department: addUser.department,
                    employeeID: addUser.employeeID,
                    nickName: addUser.nickName,
                    phone: addUser.phone,
                    computerName: addUser.computerName,
                    position: addUser.position,
                    division: addUser.division,
                    location: addUser.location
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("เพิ่มผู้ใช้ใหม่สำเร็จ");
                setIsModalAddUser(false);
                // Reset form
                setAddUser({
                    username: '',
                    password: '',
                    email: '',
                    fullName: '',
                    role: 'user',
                    role_status: 'pending',
                    company: '',
                    department: '',
                    employeeID: '',
                    nickName: '',
                    phone: '',
                    computerName: '',
                    position: '',
                    division: '',
                    location: ''
                });
                // Refresh user list
                fetchUser();
            } else {
                toast.error(data.message || "เกิดข้อผิดพลาดในการเพิ่มผู้ใช้");
            }
        } catch (error) {
            console.error("Error adding user:", error);
            toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
        } finally {
            hideLoading(); // ซ่อน loading state
        }

    };

    const closeModal = () => {
        setIsModalUpdate(false);
        setIsModalDelete(false);
        setNewUserData("");
    };
    const closeModalResetpaassword = () => {
        setIsModalResetpassword(false);
        setErrorMessage("");  // เคลียร์ข้อความผิดพลาด
        setSuccessMessage("");  // เคลียร์ข้อความสำเร็จ

        // เคลียร์ค่าของฟอร์ม
        setNewPassword("");  // รีเซ็ตรหัสผ่านใหม่
        setConfirmPassword("");  // รีเซ็ตรหัสผ่านยืนยัน
        setNewUserData({
            fullName: "",  // เคลียร์ชื่อ
            username: "",  // เคลียร์ชื่อผู้ใช้
            nickName: "",  // เคลียร์ชื่อเล่น
            // เคลียร์ค่าอื่นๆ ที่คุณต้องการ
        });
    };

    const closeModalAddUser = () => {
        setIsModalAddUser(false);
        // Reset form
        setAddUser({
            username: '',
            password: '',
            email: '',
            fullName: '',
            role: 'user',
            role_status: 'pending',
            company: '',
            department: '',
            employeeID: '',
            nickName: '',
            phone: '',
            computerName: '',
            position: '',
            division: '',
            location: ''
        });
    };

    return (
        <div className="flex-1 min-h-screen overflow-auto p-16 bg-gray-50 dark:bg-gray-800">
            <h1 className="text-2xl font-bold mb-6">User Management</h1>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-4">
                    {["Dashboard", "User List", "Add User", "User Details", "Edit User"].map((tab) => (
                        <button
                            key={tab}
                            style={{
                                color: activeTab === tab ? getColorFromTheme(theme.primaryColor, theme.primaryWeight) : "#6b7280", // สีตัวอักษร
                                borderBottom: activeTab === tab ? `2px solid ${getColorFromTheme(theme.primaryColor, theme.primaryWeight)}` : "none", // เส้นใต้
                            }}

                            className="py-2 px-4 font-semibold hover:opacity-80"
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>

                    ))}
                </nav>
            </div>


            {/* Content */}
            <button
                onClick={handleAddUser}
                className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 flex items-center gap-2"
            >
                <FaUserPlus className="text-xl" />
                Add New User
            </button>

            {activeTab === "User List" && (
                <div className="text-gray-500 dark:text-gray-400 p-6">
                    <div className="mt-6">
                        <table className="table-auto w-full border-collapse bg-white">
                            <thead>
                                <tr className="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                                    <th className="border-t border-b border-gray-300 dark:border-gray-600 py-2">ลำดับ</th>
                                    <th className="border-t border-b border-gray-300 dark:border-gray-600 py-2">user_info</th>
                                    <th className="border-t border-b border-gray-300 dark:border-gray-600 py-2">user name</th>
                                    <th className="border-t border-b border-gray-300 dark:border-gray-600 py-2">email</th>
                                    <th className="border-t border-b border-gray-300 dark:border-gray-600 py-2">role</th>
                                    <th className="border-t border-b border-gray-300 dark:border-gray-600 py-2">status</th>
                                    <th className="border-t border-b border-gray-300 dark:border-gray-600 py-2">creact At</th>
                                    <th className="border-t border-b border-gray-300 dark:border-gray-600 py-2">Last_login</th>
                                    <th className="border-t border-b border-gray-300 dark:border-gray-600 py-2">online_status</th>
                                    <th className="border-t border-b border-gray-300 dark:border-gray-600 py-2">manage</th>
                                </tr>
                            </thead>

                            <tbody>
                                {Array.isArray(users) && users.length > 0 ? (
                                    users.map((userM, index) => (
                                        <tr key={userM._id}>
                                            <td className="border-t border-b border-gray-300 dark:border-gray-600 text-center align-middle p-4">{index + 1}</td>

                                            <td className="relative group border-t border-b border-gray-300 dark:border-gray-600 text-center align-middle p-0">
                                                <div className="flex items-center justify-center min-h-[60px]">
                                                    <div className="relative w-10 h-10">
                                                        <Image
                                                            src={userM.username
                                                                ? `/api/profile/getImage/${userM.username}.${userM.profileImageExtension || 'jpg'}`
                                                                : "/api/profile/getImage/placeholder.png"
                                                            }
                                                            alt={`Profile of ${userM.username}`}
                                                            width={40}
                                                            height={40}
                                                            className="rounded-full object-cover w-full h-full"
                                                            style={{
                                                                aspectRatio: "1/1",
                                                            }}
                                                            onError={(e) => {
                                                                e.currentTarget.src = "/api/profile/getImage/placeholder.png";
                                                            }}
                                                        />
                                                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:inline-block bg-gray-800 text-white text-xs py-1 px-2 rounded shadow-lg whitespace-nowrap text-left">
                                                            <p><strong>Nickname:</strong> {userM.nickName || "N/A"}</p>
                                                            <p><strong>Department:</strong> {userM.department || "N/A"}</p>
                                                            <p><strong>Position:</strong> {userM.position || "N/A"}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="border-t border-b border-gray-300 dark:border-gray-600 pl-2">{userM.username}</td>
                                            <td className="p-4 border-b border-gray-300 dark:border-gray-600 text-center">{userM.email || ""}</td>

                                            <td className="border-t border-b border-gray-300 dark:border-gray-600 text-center align-middle">{userM.role || ""}</td>
                                            <td className="border-t border-b border-gray-300 dark:border-gray-600 text-center align-middle">
                                                <div className="whitespace-nowrap">
                                                    {userM.role_status === "approved" ? (
                                                        <span className="text-green-500">● Approved</span>
                                                    ) : userM.role_status === "pending" ? (
                                                        <span className="text-yellow-500">● Pending</span>
                                                    ) : (
                                                        ""
                                                    )}
                                                </div>
                                            </td>

                                            <td className="relative group border-t border-b border-gray-300 dark:border-gray-600 text-center align-middle">
                                                {userM.createdAt ? (
                                                    <>
                                                        {new Date(userM.createdAt).toLocaleDateString("en-GB")}
                                                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:inline-block bg-gray-800 text-white text-xs py-1 px-2 rounded shadow-lg whitespace-nowrap">
                                                            {new Date(userM.createdAt).toLocaleTimeString("th-TH", {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            })} น.
                                                        </span>
                                                    </>
                                                ) : (
                                                    ""
                                                )}
                                            </td>

                                            <td className="relative group border-t border-b border-gray-300 dark:border-gray-600 text-center align-middle">
                                                {userM.lastLogin ? (
                                                    <>
                                                        {new Date(userM.lastLogin).toLocaleDateString("en-GB")}
                                                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:inline-block bg-gray-800 text-white text-xs py-1 px-2 rounded shadow-lg whitespace-nowrap">
                                                            {new Date(userM.lastLogin).toLocaleTimeString("th-TH", {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            })} น.
                                                        </span>
                                                    </>
                                                ) : (
                                                    ""
                                                )}
                                            </td>

                                            <td className="border-t border-b border-gray-300 dark:border-gray-600 pl-2 text-center align-middle">
                                                <span
                                                    className={`inline-flex w-2.5 h-2.5 rounded-full mr-2 ${userM?.online ? 'bg-green-500' : 'bg-red-500'}`}
                                                ></span>
                                                {userM?.online ? "ออนไลน์" : "ออฟไลน์"}
                                            </td>

                                            <td className="border-t border-b border-gray-300 dark:border-gray-600 text-center align-middle p-2">
                                                <div className="flex items-center justify-center space-x-2 flex-nowrap min-w-[120px]">
                                                    {/* Edit button for users */}
                                                    {user && user.role !== "superadmin" && userM?.role === 'user' && (
                                                        <button
                                                            className="text-blue-500 font-semibold text-md hover:text-blue-700 hover:border-b-2 hover:border-blue-500 focus:outline-none"
                                                            onClick={() => handleEdit(userM)}
                                                        >
                                                            Edit
                                                        </button>
                                                    )}


                                                    {/* Superadmin buttons */}
                                                    {user && user.role === "superadmin" && (
                                                        <>
                                                            <button
                                                                className="inline-flex items-center justify-center bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 hover:scale-105 transform transition-all duration-200"
                                                                onClick={() => handleEdit(userM)}
                                                            >
                                                                <FaUserEdit className="text-xl" />
                                                            </button>
                                                            <button
                                                                className="inline-flex items-center justify-center bg-yellow-500 text-white p-2 rounded-full hover:bg-yellow-600 hover:scale-105 transform transition-all duration-200"
                                                                onClick={() => handleResetPassword(userM)}
                                                            >
                                                                <MdOutlineLockReset className="text-xl" />
                                                            </button>
                                                            <button
                                                                className="inline-flex items-center justify-center bg-red-500 text-white p-2 rounded-full hover:bg-red-600 hover:scale-105 transform transition-all duration-200"
                                                                onClick={() => handleDelete(userM)}
                                                            >
                                                                <MdDelete className="text-xl" />
                                                            </button>

                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="10">ไม่มีข้อมูลผู้ใช้</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}



            {/* Modal for Editing User */}
            {isModalUpdat && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-md shadow-md w-full max-w-3xl max-h-[90%] overflow-y-auto mx-auto">
                        <h2 className="text-2xl font-semibold mb-4 text-center">Edit User</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Full Name */}
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-200">Full Name</label>
                                <input
                                    type="text"
                                    value={newUserData.fullName || ""}
                                    onChange={(e) => setNewUserData({ ...newUserData, fullName: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            {/* Username */}
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-200">Username</label>
                                {user?.role === "superadmin" ? (
                                    <input
                                        type="text"
                                        value={newUserData.username || ""}
                                        onChange={(e) => setNewUserData({ ...newUserData, username: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        value={newUserData.username || ""}
                                        disabled
                                        className="w-full p-2 border border-gray-300 rounded-md bg-gray-200 text-gray-500"
                                    />
                                )}
                            </div>


                            {/* Email */}
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-200">Email</label>
                                <input
                                    type="email"
                                    value={newUserData.email || ""}
                                    onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            {/* Nickname */}
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-200">Nick Name</label>
                                <input
                                    type="text"
                                    value={newUserData.nickName || ""}
                                    onChange={(e) => setNewUserData({ ...newUserData, nickName: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            {/* Phone */}
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-200">Phone</label>
                                <input
                                    type="text"
                                    value={newUserData.phone || ""}
                                    onChange={(e) => setNewUserData({ ...newUserData, phone: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            {/* Position */}
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-200">Position</label>
                                <input
                                    type="text"
                                    value={newUserData.position || ""}
                                    onChange={(e) => setNewUserData({ ...newUserData, position: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            {/* Division */}
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-200">Division</label>
                                <input
                                    type="text"
                                    value={newUserData.division || ""}
                                    onChange={(e) => setNewUserData({ ...newUserData, division: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            {/* Location */}
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-200">Location</label>
                                <input
                                    type="text"
                                    value={newUserData.location || ""}
                                    onChange={(e) => setNewUserData({ ...newUserData, location: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            {/* Department */}
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-200">Department</label>
                                <input
                                    type="text"
                                    value={newUserData.department || ""}
                                    onChange={(e) => setNewUserData({ ...newUserData, department: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            {/* Company */}
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-200">Company</label>
                                <input
                                    type="text"
                                    value={newUserData.company || ""}
                                    onChange={(e) => setNewUserData({ ...newUserData, company: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            {/* Profile Image */}
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-200">Profile Image</label>
                                <input
                                    type="text"
                                    value={newUserData.profileImage || ""}
                                    onChange={(e) => setNewUserData({ ...newUserData, profileImage: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            {/* Employee ID */}
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-200">Employee ID</label>
                                <input
                                    type="text"
                                    value={newUserData.employeeID || ""}
                                    onChange={(e) => setNewUserData({ ...newUserData, employeeID: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                            </div>


                            {/* Role */}
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-200">Role</label>
                                {user?.role === "superadmin" ? (
                                    <select
                                        value={newUserData.role || "user"}
                                        onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                        <option value="superadmin">Superadmin</option>
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        value={newUserData.role || "user"}
                                        disabled
                                        className="w-full p-2 border border-gray-300 rounded-md bg-gray-200 text-gray-500"
                                    />
                                )}
                            </div>



                            {/* Role Status */}
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-200">Role Status</label>
                                <select
                                    value={newUserData.role_status || "pending"}
                                    onChange={(e) => setNewUserData({ ...newUserData, role_status: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>

                                </select>
                            </div>



                        </div>

                        {/* Buttons */}
                        <div className="mt-6 flex justify-end space-x-4">
                            <button
                                onClick={closeModal}
                                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                            >
                                Close
                            </button>
                            <button
                                onClick={updateUser}
                                className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
                            >
                                Update User
                            </button>
                        </div>

                    </div>
                </div>
            )}


            {isModalResetpassword && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-md shadow-md w-full max-w-4xl sm:max-w-3xl md:max-w-2xl lg:max-w-2xl xl:max-w-2xl mx-4 sm:mx-8">
                        <h2 className="text-2xl font-semibold mb-4 text-center">รีเซ็ตรหัสผ่าน</h2>

                        {/* ข้อมูลผู้ใช้ */}
                        <div className="mb-4">
                            <p className="text-gray-700 text-sm">ชื่อเต็ม: <span className="font-semibold">{newUserData.fullName || ""}</span></p>
                            <p className="text-gray-700 text-sm">ชื่อเล่น: <span className="font-semibold">{newUserData.nickName || ""}</span></p>
                            <p className="text-gray-700 text-sm">ชื่อผู้ใช้: <span className="font-semibold">{newUserData.username || ""}</span></p>
                        </div>

                        {/* ข้อความผิดพลาด */}
                        {errorMessage && <div className="text-red-500 text-sm mb-4">{errorMessage}</div>}

                        {/* ข้อความสำเร็จ */}
                        {successMessage && <div className="text-green-500 text-sm mb-4">{successMessage}</div>}

                        {/* ฟอร์มกรอกรหัสผ่านใหม่ */}
                        <div className="mb-4">
                            <label htmlFor="newPassword" className="block text-gray-700">รหัสผ่านใหม่</label>
                            <input
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className={`w-full p-2 border ${newPassword.length > 0 && newPassword.length < 6 ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                placeholder="กรอกรหัสผ่านใหม่"
                            />
                            {newPassword.length > 0 && newPassword.length < 6 && (
                                <p className="text-red-500 text-sm mt-1">รหัสผ่านต้องมีอย่างน้อย 6 ตัว</p>
                            )}
                        </div>

                        {/* ฟอร์มกรอกการยืนยันรหัสผ่านใหม่ */}
                        <div className="mb-4">
                            <label htmlFor="confirmPassword" className="block text-gray-700">ยืนยันรหัสผ่านใหม่</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={`w-full p-2 border ${confirmPassword && newPassword !== confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                placeholder="กรอกยืนยันรหัสผ่านใหม่"
                            />
                            {confirmPassword && newPassword !== confirmPassword && (
                                <p className="text-red-500 text-sm mt-1">รหัสผ่านไม่ตรงกัน</p>
                            )}
                        </div>

                        {/* ปุ่มรีเซ็ตรหัสผ่าน */}
                        <div className="mt-6 flex justify-end space-x-4">
                            <button
                                onClick={closeModalResetpaassword}
                                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                            >
                                ปิด
                            </button>
                            <button
                                onClick={ResetPassword}
                                className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
                                disabled={newPassword.length < 6 || newPassword !== confirmPassword}  // ปิดปุ่มหากรหัสผ่านไม่ครบ 6 ตัวหรือไม่ตรงกัน
                            >
                                รีเซ็ตรหัสผ่าน
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isModalDelete && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h3 className="text-xl font-semibold mb-4">ยืนยันการลบผู้ใช้</h3>
                        <p className="mb-4">คุณต้องการลบผู้ใช้ดังนี้หรือไม่:</p>
                        <div className="mb-4">
                            {/* แสดงข้อมูลของผู้ใช้ที่ต้องการลบ */}
                            <p><strong>Username:</strong> {newUserData.username}</p>
                            <p><strong>Full Name:</strong> {newUserData.fullName}</p>
                            <p><strong>Nickname:</strong> {newUserData.nickName || ""}</p>
                        </div>

                        {/* ปุ่มสำหรับยกเลิกหรือยืนยันการลบ */}
                        <div className="flex justify-between">
                            {/* ปุ่มยกเลิก */}
                            <button
                                className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                                onClick={closeModal}
                            >
                                ยกเลิก
                            </button>

                            {/* ปุ่มยืนยันการลบ */}
                            <button
                                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                                onClick={DeleteUser} // เรียกฟังก์ชันลบ
                            >
                                ยืนยันการลบ
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isModalAddUser && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-md shadow-md w-full max-w-3xl max-h-[90%] overflow-y-auto mx-auto">
                        <h2 className="text-2xl font-semibold mb-4 text-center">Add New User</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Username - Required */}
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-200">
                                    Username <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={addUser.username}
                                    onChange={(e) => setAddUser({ ...addUser, username: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>

                            {/* Password - Required */}
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-200">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={addUser.password}
                                    onChange={(e) => setAddUser({ ...addUser, password: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>

                            {/* Email - Required */}
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-200">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={addUser.email}
                                    onChange={(e) => setAddUser({ ...addUser, email: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            {/* Full Name */}
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-200">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={addUser.fullName}
                                    onChange={(e) => setAddUser({ ...addUser, fullName: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            {/* Nickname */}
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-200">
                                    Nickname
                                </label>
                                <input
                                    type="text"
                                    value={addUser.nickName}
                                    onChange={(e) => setAddUser({ ...addUser, nickName: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            {/* Phone */}
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-200">
                                    Phone
                                </label>
                                <input
                                    type="text"
                                    value={addUser.phone}
                                    onChange={(e) => setAddUser({ ...addUser, phone: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            {/* Position */}
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-200">
                                    Position
                                </label>
                                <input
                                    type="text"
                                    value={addUser.position}
                                    onChange={(e) => setAddUser({ ...addUser, position: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            {/* Division */}
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-200">
                                    Division
                                </label>
                                <input
                                    type="text"
                                    value={addUser.division}
                                    onChange={(e) => setAddUser({ ...addUser, division: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            {/* Department */}
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-200">
                                    Department
                                </label>
                                <input
                                    type="text"
                                    value={addUser.department}
                                    onChange={(e) => setAddUser({ ...addUser, department: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            {/* Company */}
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-200">
                                    Company
                                </label>
                                <input
                                    type="text"
                                    value={addUser.company}
                                    onChange={(e) => setAddUser({ ...addUser, company: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            {/* Employee ID */}
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-200">
                                    Employee ID
                                </label>
                                <input
                                    type="text"
                                    value={addUser.employeeID}
                                    onChange={(e) => setAddUser({ ...addUser, employeeID: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            {/* Role */}
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-200">Role</label>
                                <select
                                    value={addUser.role}
                                    onChange={(e) => setAddUser({ ...addUser, role: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    disabled={user?.role !== 'superadmin'} // หาก user ไม่ใช่ superadmin จะปิดการใช้งาน
                                >
                                    {/* เงื่อนไขแสดงรายการ role */}
                                    {user?.role === 'superadmin' && (
                                        <>
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                            <option value="superadmin">Superadmin</option>
                                        </>
                                    )}

                                    {user?.role === 'admin' && (
                                        <>
                                            <option value="user">User</option>
                                        </>
                                    )}
                                </select>
                            </div>


                            {/* Role Status */}
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-200">Role Status</label>
                                <select
                                    value={addUser.role_status}
                                    onChange={(e) => setAddUser({ ...addUser, role_status: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                </select>
                            </div>
                        </div>

                        {/* Error Message */}
                        {errorMessage && (
                            <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
                        )}

                        {/* Buttons */}
                        <div className="mt-6 flex justify-end space-x-4">
                            <button
                                onClick={closeModalAddUser}
                                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={AddUser}
                                className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600"
                            >
                                Add User
                            </button>
                        </div>
                    </div>
                </div>
            )}







            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );

}
