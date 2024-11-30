"use client";

import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { FaSave, FaTimes, FaCamera, FaCog, FaBell, FaUser, FaUserCircle, FaBuilding, FaBriefcase, FaEnvelope, FaPhone } from "react-icons/fa";

export default function ProfilePage() {
    const { user, setUser } = useUser();
    const [isEditing, setIsEditing] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [formData, setFormData] = useState({
        fullName: user?.fullName || "",
        nickname: user?.nickname || "",
        department: user?.department || "",
        company: user?.company || "",
        email: user?.email || "",
        phone: user?.phone || "",
        profileImage: user?.profileImage || "https://picsum.photos/200/300",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setFormData({ ...formData, profileImage: event.target.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        setUser({ ...user, ...formData });
        setIsEditing(false);
    };

    return (
        <div className="max-w-4xl mx-auto mt-12 p-8 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-xl shadow-lg">
            {/* Header Section */}
            <div className="text-center">
                <h1 className="text-5xl font-extrabold text-purple-700">My Profile</h1>
                <p className="text-gray-600 mt-2">
                    Manage your personal information and account settings
                </p>
            </div>

            {/* Profile Picture */}
            <div className="flex justify-center mt-8">
                <div className="relative group">
                    <img
                        src={formData.profileImage}
                        alt="Profile"
                        className="w-36 h-36 rounded-full border-4 border-pink-300 shadow-lg"
                    />
                    {isEditing && (
                        <label className="absolute bottom-0 right-0 w-10 h-10 bg-pink-500 text-white rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-pink-600">
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                            <FaCamera />
                        </label>
                    )}
                </div>
            </div>

            {/* Profile Details */}
            <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-3xl font-extrabold text-purple-700 mb-6">
                    Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        { label: "Full Name", name: "fullName", icon: FaUser },
                        { label: "Nickname", name: "nickname", icon: FaUserCircle },
                        { label: "Department", name: "department", icon: FaBuilding },
                        { label: "Company", name: "company", icon: FaBriefcase },
                        { label: "Email", name: "email", icon: FaEnvelope },
                        { label: "Phone", name: "phone", icon: FaPhone },
                    ].map((field) => (
                        <div
                            key={field.name}
                            className="relative flex items-center border-b border-gray-300 py-2"
                        >
                            <field.icon className="text-gray-500 text-lg mr-3" />
                            {isEditing ? (
                                <input
                                    type="text"
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={handleInputChange}
                                    className="flex-1 border-none focus:ring-0 focus:outline-none text-gray-800"
                                    placeholder={`Enter ${field.label}`}
                                />
                            ) : (
                                <p className="flex-1 text-gray-800 font-medium">
                                    {formData[field.name]}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Buttons */}
            <div className="mt-8 flex justify-between items-center">
                <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-200 text-purple-700 rounded-lg font-medium hover:bg-purple-300 transition-all duration-300"
                >
                    <FaCog className="inline-block" />
                    <span>Settings</span>
                </button>

                {isEditing ? (
                    <div className="flex space-x-4">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400 transition-all duration-300"
                        >
                            <FaTimes className="inline-block mr-2" />
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-6 py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-all duration-300"
                        >
                            <FaSave className="inline-block mr-2" />
                            Save
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-all duration-300"
                    >
                        Edit Profile
                    </button>
                )}
            </div>

            {/* Settings Section */}
            {showSettings && (
                <div className="mt-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold text-purple-700 mb-4">
                        Account Settings
                    </h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-700 font-medium">Enable Notifications</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-purple-500 peer-focus:ring-2 peer-focus:ring-purple-300"></div>
                                <span className="ml-3 text-gray-600">On</span>
                            </label>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-700 font-medium">Change Password</span>
                            <button className="px-4 py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-all duration-300">
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
