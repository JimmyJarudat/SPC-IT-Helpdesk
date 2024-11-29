"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const PendingApproval = () => {
    const [roleStatus, setRoleStatus] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUserStatus = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/login");
                return;
            }

            try {
                const res = await fetch("/api/userStatus", {
                    headers: {
                        Authorization: `Bearer ${token}`, // ส่ง JWT Token ใน Header
                    },
                });

                if (!res.ok) {
                    throw new Error(`Failed to fetch user status. Status: ${res.status}`);
                }

                const data = await res.json();
                setRoleStatus(data.role_status);

                if (data.role_status === "approved") {
                    router.push("/");
                }
            } catch (error) {
                console.error("Error fetching user status:", error.message);
                router.push("/login");
            }
        };

        fetchUserStatus();
    }, [router]);

    if (roleStatus === "approved") {
        return null;
    }

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
