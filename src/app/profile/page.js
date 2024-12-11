"use client";

import { useEffect, useState } from "react";
import { FaUser, FaKey, FaLock, FaUserTag, FaCamera, FaEnvelope, FaPhone, FaBuilding, FaIdBadge } from "react-icons/fa";
import { useTheme } from "../../contexts/ThemeContext";
import { getColorFromTheme } from '../../utils/colorMapping'
import { useUser } from "@/contexts/UserContext";
import { useLoading } from "@/contexts/LoadingContext";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";




export default function ProfilePage() {
    const { user, setUpdateStatus } = useUser();
    const { theme } = useTheme();
    const { showLoading, hideLoading } = useLoading();


    const [errors, setErrors] = useState({}); // เก็บข้อผิดพลาดของฟิลด์ต่างๆ
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [uploadStatus, setUploadStatus] = useState("");
    const [uploadedFilePath, setUploadedFilePath] = useState("");


    const [formData, setFormData] = useState({
        fullName: "",
        nickName: "",
        email: "",
        phone: "",
        employeeID: "",
        computerName: "",
        company: "",
        location: "",
        position: "",
        division: "",
        department: "",
        profileImage: uploadedFilePath,
    });

    const [activeTab, setActiveTab] = useState("Profile");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            showLoading();
            try {
                const response = await fetch("/api/profile/profileupdate", {
                    method: "GET",
                });

                if (response.ok) {
                    hideLoading();
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
                                setUploadedFilePath(data.profileImage);
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
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
    
        // ตรวจสอบรูปแบบของอีเมล
        if (name === "email") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                setErrors((prev) => ({ ...prev, email: "Invalid email format." }));
            } else {
                setErrors((prev) => ({ ...prev, email: "" })); // ลบข้อผิดพลาดเมื่อกรอกถูกต้อง
            }
        }
    
        // ตรวจสอบเบอร์โทรศัพท์ (3 หลักเท่านั้น)
        if (name === "phone") {
            const phoneRegex = /^\d{3}$/; // เบอร์โทรต้องเป็นตัวเลข 3 หลัก
            if (!phoneRegex.test(value)) {
                setErrors((prev) => ({ ...prev, phone: "Phone number must be exactly 3 digits." }));
            } else {
                setErrors((prev) => ({ ...prev, phone: "" })); // ลบข้อผิดพลาดเมื่อกรอกถูกต้อง
            }
        }
    
        // อัปเดตฟอร์มข้อมูล
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    
    
    const handleUpdate = async () => {
        showLoading();
        setLoading(true);

        // ตรวจสอบข้อผิดพลาดก่อนบันทึก
        if (errors.email|| errors.phone) {
            toast.error("Please fix the errors before saving.");
            hideLoading();
            setLoading(false);
            return;
        }

        try {
            // สร้างข้อมูลที่จะส่ง
            const updatedData = {
                ...formData,
            };

            // ตรวจสอบว่า selectedFile มีค่าหรือไม่
            if (selectedFile) {
                updatedData.profileImage = uploadedFilePath; // ใช้พาทใหม่เมื่อมีการอัปโหลดรูป
            } else {
                // ใช้ค่าพาทเดิม หาก profileImage เป็น blob URL
                updatedData.profileImage = formData.profileImage.startsWith("blob:")
                    ? formData.profileImageFromDatabase // ใช้ค่าพาทเดิมจากฐานข้อมูล
                    : formData.profileImage; // ใช้พาทปัจจุบัน
            }

            const response = await fetch("/api/profile/profileupdate", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedData), // ส่งข้อมูลที่อัปเดตไปยัง API
            });

            if (response.ok) {
                // alert("Profile updated successfully!");
                toast.success("Profile updated successfully!");
                setUpdateStatus(true);
            } else {
                const errorData = await response.json();
                toast.error(`Error: ${errorData.message}`);
                setErrors({ [errorData.field]: errorData.message });
            }

        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("An unexpected error occurred.");
        } finally {
            hideLoading();
            setLoading(false); // ปิดสถานะการโหลด
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        const currentPassword = document.getElementById("current-password").value;
        const newPassword = document.getElementById("new-password").value;
        const confirmPassword = document.getElementById("confirm-password").value;

        if (newPassword !== confirmPassword) {
            alert("New Password and Confirm Password do not match.");
            return;
        }

        try {
            const response = await fetch("/api/profile/profileupdate", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            if (response.ok) {
                alert("Password changed successfully!");

                // ล้างค่าฟิลด์รหัสผ่านในฟอร์ม
                document.getElementById("current-password").value = "";
                document.getElementById("new-password").value = "";
                document.getElementById("confirm-password").value = "";
            } else {
                const errorData = await response.json();
                alert(`Failed to change password: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Error changing password:", error);
            alert("Error changing password.");
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file); // สร้าง URL ชั่วคราวสำหรับพรีวิว
            setPreviewImage(previewUrl);

            const formDataToSend = new FormData();
            formDataToSend.append("profileImage", file);
            formDataToSend.append("username", user.username);

            fetch("/api/profile/uploadImage", {
                method: "POST",
                body: formDataToSend,
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.filePath) {
                        setUploadedFilePath(data.filePath); // เก็บพาทจริงจาก API
                        setFormData((prev) => ({
                            ...prev,
                            profileImage: data.filePath, // อัปเดตพาทจริงใน formData
                        }));
                    }
                })
                .catch((error) => console.error("Error uploading image:", error));
        }
    };

    return (
        <div className="flex-1 min-h-screen overflow-auto p-16 bg-gray-100 dark:bg-gray-800">
            <h1 className="text-2xl font-bold mb-6">Settings</h1>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-4">
                    {["Profile", "Password", "Notification", "Integration", "Billing"].map((tab) => (
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
            {activeTab === "Profile" && (
                <div>
                    <h2 className="text-xl font-semibold mb-4">General Information</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Update your basic profile information below.
                    </p>

                    {/* Form */}
                    <div className="space-y-6">
                        {/* Profile Image */}
                        <div className="grid grid-cols-12 items-center pb-4 border-b border-gray-300 dark:border-gray-700">
                            <label className="col-span-3 text-gray-700 dark:text-gray-200 font-medium justify-self-start">
                                Profile Image
                            </label>
                            <div className="col-span-9 flex items-center justify-start w-[80%] ml-auto">
                                <div className="relative w-16 h-16 mr-4">
                                    {/* Profile image preview */}
                                    <img
                                        src={previewImage || formData.profileImage || "https://via.placeholder.com/150"}
                                        alt="Profile"
                                        className="w-16 h-16 rounded-full border border-gray-300 dark:border-gray-700 object-cover"
                                    />


                                    {/* Button to trigger file input */}
                                    <button
                                        className="absolute bottom-0 right-0 bg-gray-800 text-white p-1 rounded-full hover:bg-gray-600"
                                        title="Change Image"
                                        onClick={() => document.getElementById("profileImageInput").click()}
                                    >
                                        <FaCamera className="w-4 h-4" />
                                    </button>

                                    {/* Hidden file input */}
                                    <input
                                        id="profileImageInput"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"

                                        onChange={handleFileChange}
                                    />
                                </div>

                                {/* Upload button */}
                                {uploadStatus && <p className="mt-2">{uploadStatus}</p>}
                            </div>
                        </div>

                        {/* Full Name */}
                        <div className="grid grid-cols-12 items-center pb-4 border-b border-gray-300 dark:border-gray-700">
                            <label className="col-span-3 text-gray-700 dark:text-gray-200 font-medium justify-self-start">
                                Full Name
                            </label>
                            <div className="relative col-span-9 justify-self-start w-[80%] ml-auto">
                                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-300" />
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName || ""}
                                    onChange={handleChange}
                                    placeholder="Enter your Full name"
                                    className="w-full pl-10 p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                                />
                            </div>
                        </div>

                        {/* Nickname */}
                        <div className="grid grid-cols-12 items-center pb-4 border-b border-gray-300 dark:border-gray-700">
                            <label className="col-span-3 text-gray-700 dark:text-gray-200 font-medium justify-self-start">
                                Nickname
                            </label>
                            <div className="relative col-span-9 justify-self-start w-[80%] ml-auto">
                                <FaUserTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-300" />
                                <input
                                    type="text"
                                    name="nickName"
                                    value={formData.nickName || ""}
                                    onChange={handleChange}
                                    placeholder="Enter your Nickname"
                                    className="w-full pl-10 p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="grid grid-cols-12 items-center pb-4 border-b border-gray-300 dark:border-gray-700">
                            <label className="col-span-3 text-gray-700 dark:text-gray-200 font-medium justify-self-start">
                                Email
                            </label>
                            <div className="relative col-span-9 justify-self-start w-[80%] ml-auto">
                                {/* ไอคอน */}
                                <FaEnvelope
                                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${errors.email ? "text-red-500" : "text-gray-600 dark:text-gray-300"
                                        }`}
                                />
                                {/* อินพุต */}
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email || ""}
                                    onChange={handleChange}
                                    className={`w-full pl-10 p-2 border ${errors.email ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                                        } rounded dark:bg-gray-800 dark:text-gray-300`}
                                    placeholder="Enter your email"
                                />
                                {/* ข้อความแจ้งเตือน */}
                                {errors.email && (
                                    <p className="absolute mt-2 text-sm text-red-500">
                                        {errors.email}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* phone */}
                        <div className="grid grid-cols-12 items-center pb-4 border-b border-gray-300 dark:border-gray-700">
                            <label className="col-span-3 text-gray-700 dark:text-gray-200 font-medium justify-self-start">
                                Phone
                            </label>
                            <div className="relative col-span-9 justify-self-start w-[80%] ml-auto">
                                {/* ไอคอน */}
                                <FaPhone
                                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${errors.phone ? "text-red-500" : "text-gray-600 dark:text-gray-300"
                                        }`}
                                />
                                {/* อินพุต */}
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone || ""}
                                    onChange={handleChange}
                                    className={`w-full pl-10 p-2 border ${errors.phone ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                                        } rounded dark:bg-gray-800 dark:text-gray-300`}
                                    placeholder="Enter your phone number"
                                />
                                {/* ข้อความแจ้งเตือน */}
                                {errors.phone && (
                                    <p className="absolute mt-2 text-sm text-red-500">
                                        {errors.phone}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Employee ID */}
                        <div className="grid grid-cols-12 items-center pb-4 border-b border-gray-300 dark:border-gray-700">
                            <label className="col-span-3 text-gray-700 dark:text-gray-200 font-medium justify-self-start">
                                Employee ID
                            </label>
                            <div className="relative col-span-9 justify-self-start w-[80%] ml-auto">
                                <FaIdBadge className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-300" />
                                <input
                                    type="text"
                                    name="employeeID"
                                    value={formData.employeeID || ""}
                                    onChange={handleChange}
                                    placeholder="Enter your Employee ID"
                                    className="w-full pl-10 p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                                />
                            </div>
                        </div>

                        {/* Computer Name */}
                        <div className="grid grid-cols-12 items-center pb-4 border-b border-gray-300 dark:border-gray-700">
                            <label className="col-span-3 text-gray-700 dark:text-gray-200 font-medium justify-self-start">
                                Computer Name
                            </label>
                            <div className="relative col-span-9 justify-self-start w-[80%] ml-auto">
                                <FaIdBadge className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-300" />
                                <input
                                    type="text"
                                    name="computerName"
                                    value={formData.computerName || ""}
                                    onChange={handleChange}
                                    placeholder="Enter your Employee ID"
                                    className="w-full pl-10 p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                                />
                            </div>
                        </div>

                        {/* Company */}
                        <div className="grid grid-cols-12 items-center pb-4 border-b border-gray-300 dark:border-gray-700">
                            <label className="col-span-3 text-gray-700 dark:text-gray-200 font-medium justify-self-start">
                                Company
                            </label>
                            <div className="relative col-span-9 justify-self-start w-[80%] ml-auto">
                                <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-300" />
                                <input
                                    type="text"
                                    name="company"
                                    value={formData.company || ""}
                                    onChange={handleChange}
                                    placeholder="Enter your Company "
                                    className="w-full pl-10 p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                                />
                            </div>
                        </div>

                        {/* location */}
                        <div className="grid grid-cols-12 items-center pb-4 border-b border-gray-300 dark:border-gray-700">
                            <label className="col-span-3 text-gray-700 dark:text-gray-200 font-medium justify-self-start">
                                Location
                            </label>
                            <div className="relative col-span-9 justify-self-start w-[80%] ml-auto">
                                <FaUserTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-300" />
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location || ""}
                                    onChange={handleChange}
                                    placeholder="Enter your Location"
                                    className="w-full pl-10 p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                                />
                            </div>
                        </div>

                        {/* position */}
                        <div className="grid grid-cols-12 items-center pb-4 border-b border-gray-300 dark:border-gray-700">
                            <label className="col-span-3 text-gray-700 dark:text-gray-200 font-medium justify-self-start">
                                Position
                            </label>
                            <div className="relative col-span-9 justify-self-start w-[80%] ml-auto">
                                <FaUserTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-300" />
                                <input
                                    type="text"
                                    name="position"
                                    value={formData.position || ""}
                                    onChange={handleChange}
                                    placeholder="Enter your Position"
                                    className="w-full pl-10 p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                                />
                            </div>
                        </div>

                        {/* division */}
                        <div className="grid grid-cols-12 items-center pb-4 border-b border-gray-300 dark:border-gray-700">
                            <label className="col-span-3 text-gray-700 dark:text-gray-200 font-medium justify-self-start">
                                Division
                            </label>
                            <div className="relative col-span-9 justify-self-start w-[80%] ml-auto">
                                <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-300" />
                                <input
                                    type="text"
                                    name="division"
                                    value={formData.division || ""}
                                    onChange={handleChange}
                                    placeholder="Enter your Division"
                                    className="w-full pl-10 p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                                />
                            </div>
                        </div>

                        {/* Department */}
                        <div className="grid grid-cols-12 items-center pb-4 ">
                            <label className="col-span-3 text-gray-700 dark:text-gray-200 font-medium justify-self-start">
                                Department
                            </label>
                            <div className="relative col-span-9 justify-self-start w-[80%] ml-auto">
                                <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-300" />
                                <input
                                    type="text"
                                    name="department"
                                    value={formData.department || ""}
                                    onChange={handleChange}
                                    placeholder="Enter your Department"
                                    className="w-full pl-10 p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                                />
                            </div>
                        </div>

                    </div>

                    {/* Buttons */}
                    <div className="mt-6 flex justify-end gap-4">
                        <button
                            onClick={() => setFormData({})}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded shadow"
                        >
                            Reset
                        </button>
                        <button
                            onClick={handleUpdate}
                            disabled={loading} // ปิดการใช้งานปุ่มระหว่างโหลด
                            className={`flex items-center justify-center px-6 py-2 rounded shadow text-white ${loading
                                ? "bg-gray-400 cursor-not-allowed" // สีและสถานะเมื่อโหลด
                                : `bg-${theme.primaryColor.split("-")[1]}-${theme.primaryWeight} hover:opacity-80`
                                }`}
                        >
                            {loading ? (
                                <svg
                                    className="animate-spin h-5 w-5 mr-2 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v8H4z"
                                    ></path>
                                </svg>
                            ) : (
                                "Update"
                            )}
                        </button>


                    </div>
                </div>
            )}


            {activeTab === "Password" && (
                <div className="text-gray-500 dark:text-gray-400 p-6">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">Change Password</h2>
                    <form className="space-y-6" onSubmit={handleChangePassword}>
                        {/* Current Password */}
                        <div className="grid grid-cols-12 items-center pb-4 border-b border-gray-300 dark:border-gray-700">
                            <label className="col-span-3 text-gray-700 dark:text-gray-200 font-medium justify-self-start">
                                Current Password
                            </label>
                            <div className="relative col-span-9 justify-self-start w-[80%] ml-auto">
                                <FaKey className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-300" />
                                <input
                                    type="password"
                                    id="current-password"
                                    placeholder="Enter your current password"
                                    required
                                    className="w-full pl-10 p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                                />
                            </div>
                        </div>


                        {/* New Password */}
                        <div className="grid grid-cols-12 items-center pb-4 border-b border-gray-300 dark:border-gray-700">
                            <label className="col-span-3 text-gray-700 dark:text-gray-200 font-medium justify-self-start">
                                New Password
                            </label>
                            <div className="relative col-span-9 justify-self-start w-[80%] ml-auto">
                                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-300" />
                                <input
                                    type="password"
                                    id="new-password"
                                    placeholder="Enter your new password"
                                    required
                                    className="w-full pl-10 p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                                />
                            </div>
                        </div>

                        {/* Confirm New Password */}
                        <div className="grid grid-cols-12 items-center pb-4 border-b border-gray-300 dark:border-gray-700">
                            <label className="col-span-3 text-gray-700 dark:text-gray-200 font-medium justify-self-start">
                                Confirm New Password
                            </label>
                            <div className="relative col-span-9 justify-self-start w-[80%] ml-auto">
                                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-300" />
                                <input
                                    type="password"
                                    id="confirm-password"
                                    placeholder="Confirm your new password"
                                    required
                                    className="w-full pl-10 p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                                />
                            </div>
                        </div>


                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Change Password
                            </button>
                        </div>
                    </form>
                </div>
            )}



            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );

}
