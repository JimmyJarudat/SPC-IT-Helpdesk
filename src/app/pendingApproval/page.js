"use client";

import React from "react";

const PendingApproval = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-500 p-6">
            <div className="text-center p-10 bg-white rounded-lg shadow-2xl max-w-md">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-4">
                    รอการอนุมัติจากแอดมิน
                </h1>
                <p className="text-gray-600 text-lg">
                    บัญชีของคุณกำลังอยู่ในสถานะรอการอนุมัติจากแอดมิน
                </p>
                <div className="flex justify-center mt-8">
                    <div className="w-16 h-16 border-4 border-indigo-500 rounded-full animate-spin"></div>
                </div>
                <div className="mt-8 text-indigo-500 font-semibold text-sm">
                    โปรดรอสักครู่ แอดมินจะอนุมัติในเร็ว ๆ นี้
                </div>
            </div>
        </div>
    );
};

export default PendingApproval;
