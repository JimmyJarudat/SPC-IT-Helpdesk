'use client'
import React, { createContext, useContext, useState } from "react";
import { FaSpinner } from "react-icons/fa";

// สร้าง Context
const LoadingContext = createContext();

// สร้าง Provider
export const LoadingProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);

    const showLoading = () => setLoading(true);
    const hideLoading = () => setLoading(false);

    return (
        <LoadingContext.Provider value={{ loading, showLoading, hideLoading }}>
            {children}

            {/* Spinner Overlay */}
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-900 bg-opacity-50 z-50">
                    <div className="flex flex-col items-center">
                        <FaSpinner className="w-12 h-12 text-blue-500 dark:text-blue-300 animate-spin" />
                        <p className="mt-3 text-gray-900 dark:text-gray-100">กำลังโหลดข้อมูล...</p>
                    </div>
                </div>
            )}
        </LoadingContext.Provider>
    );
};

// สร้าง Hook สำหรับเรียกใช้ Context
export const useLoading = () => useContext(LoadingContext);
