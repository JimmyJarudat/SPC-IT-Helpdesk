"use client";

import React from "react";

const Unauthorized = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-300 to-blue-500 dark:from-gray-800 dark:via-gray-700 dark:to-gray-900 text-gray-900 dark:text-gray-100 p-6">
            <div className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center transform transition-transform">
                {/* Animated Icon */}
                <div className="relative w-24 h-24 mx-auto mb-6">
                    <div className="absolute inset-0 bg-red-400 rounded-full blur-2xl opacity-50 animate-spin-slow"></div>
                    <div className="relative w-20 h-20 bg-red-500 rounded-full flex items-center justify-center shadow-md">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12 text-white animate-bounce"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M18.364 5.636l-12.728 12.728m0-12.728l12.728 12.728"
                            />
                        </svg>
                    </div>
                </div>
                {/* Title */}
                <h1 className="text-4xl font-extrabold mb-4 text-red-500">
                    ไม่มีสิทธิ์เข้าถึง
                </h1>
                {/* Description */}
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                    คุณไม่สามารถเข้าถึงหน้านี้ได้ กรุณาตรวจสอบสิทธิ์ของคุณ
                </p>
                {/* Details Section */}
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-6 text-left">
                    <p className="font-semibold mb-2">โปรดตรวจสอบสิ่งต่อไปนี้:</p>
                    <ul className="list-disc list-inside">
                        <li>คุณอาจยังไม่ได้รับสิทธิ์เข้าถึงจากแอดมิน</li>
                        <li>บัญชีของคุณอาจถูกระงับการใช้งาน</li>
                        <li>โปรดตรวจสอบว่าคุณเข้าสู่ระบบด้วยบัญชีที่ถูกต้อง</li>
                    </ul>
                </div>
                {/* Support Info */}
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                    หากคุณเชื่อว่านี่เป็นข้อผิดพลาด โปรดติดต่อ:
                    <p className="mt-1">
                        <strong>แอดมินระบบ IT</strong> หรือส่งอีเมลมาที่{" "}
                        <a
                            href="mailto:support@example.com"
                            className="text-blue-500 dark:text-blue-300 underline"
                        >
                            jarudat.c@profile.co.th
                        </a>
                    </p>
                </div>
                {/* Back Button */}
                <button
                    onClick={() => window.history.back()} // ใช้ฟังก์ชัน window.history.back() เพื่อย้อนกลับ
                    className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-400 transition-colors focus:ring-2 focus:ring-blue-300"
                >
                    กลับ
                </button>

                {/* Divider Animation */}
                <div className="flex justify-center items-center mt-8 space-x-2">
                    <div className="h-2 w-8 bg-red-500 rounded-full animate-pulse"></div>
                    <div className="h-2 w-8 bg-yellow-500 rounded-full animate-pulse delay-150"></div>
                    <div className="h-2 w-8 bg-green-500 rounded-full animate-pulse delay-300"></div>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;
