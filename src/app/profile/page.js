"use client";

import { useEffect, useState } from "react";
import { FaUser, FaUserTag, FaCamera, FaEnvelope, FaPhone, FaBuilding, FaIdBadge } from "react-icons/fa";

export default function ProfilePage() {
    const [formData, setFormData] = useState({
        profileImage: "",
        fullName: "",
        nickName: "",
        email: "",
        phone: "",
        company: "",
        department: "",
        employeeID: "",
    });

    const [activeTab, setActiveTab] = useState("Profile");
    const [loading, setLoading] = useState(false);

    // ดึงข้อมูลผู้ใช้จาก API
    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const response = await fetch("/api/profile/profileupdate", {
                    method: "GET",
                });
                if (response.ok) {
                    const data = await response.json();
                    setFormData(data);
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
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/profile/profileupdate", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const updatedData = await response.json();
                setFormData(updatedData);
                alert("Profile updated successfully!");
            } else {
                alert("Failed to update profile");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Error updating profile");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        // Reset ข้อมูลฟอร์ม
        setFormData({
            profileImage: "",
            fullName: "",
            nickName: "",
            email: "",
            phone: "",
            company: "",
            department: "",
            employeeID: "",
        });
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
                            className={`py-2 px-4 ${activeTab === tab
                                ? "border-b-2 border-red-500 text-red-500 font-semibold"
                                : "text-gray-600 hover:text-red-500"
                                }`}
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
                                    <img
                                        src={formData.profileImage || "https://via.placeholder.com/150"}
                                        alt="Profile"
                                        className="w-16 h-16 rounded-full border border-gray-300 dark:border-gray-700 object-cover"
                                    />
                                    <button
                                        className="absolute bottom-0 right-0 bg-gray-800 text-white p-1 rounded-full hover:bg-gray-600"
                                        title="Change Image"
                                    >
                                        <FaCamera className="w-4 h-4" />
                                    </button>
                                </div>
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
                                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-300" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email || ""}
                                    onChange={handleChange}
                                    className="w-full pl-10 p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="grid grid-cols-12 items-center pb-4 border-b border-gray-300 dark:border-gray-700">
                            <label className="col-span-3 text-gray-700 dark:text-gray-200 font-medium justify-self-start">
                                Phone
                            </label>
                            <div className="relative col-span-9 justify-self-start w-[80%] ml-auto">
                                <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-300" />
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone || ""}
                                    onChange={handleChange}
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
                                    className="w-full pl-10 p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                                />
                            </div>
                        </div>

                        {/* Department */}
                        <div className="grid grid-cols-12 items-center pb-4 border-b border-gray-300 dark:border-gray-700">
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
                                    className="w-full pl-10 p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                                />
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
                            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded shadow"
                        >
                            Update
                        </button>
                    </div>
                </div>
            )}


            {activeTab === "Password" && (
                <div className="text-gray-500 dark:text-gray-400 p-6">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">Change Password</h2>
                    <form className="space-y-6">
                        {/* Current Password */}
                        <div>
                            <label
                                htmlFor="current-password"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Current Password
                            </label>
                            <input
                                type="password"
                                id="current-password"
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your current password"
                                required
                            />
                        </div>

                        {/* New Password */}
                        <div>
                            <label
                                htmlFor="new-password"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                New Password
                            </label>
                            <input
                                type="password"
                                id="new-password"
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your new password"
                                required
                            />
                        </div>

                        {/* Confirm New Password */}
                        <div>
                            <label
                                htmlFor="confirm-password"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                id="confirm-password"
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Confirm your new password"
                                required
                            />
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



        </div>
    );

}
