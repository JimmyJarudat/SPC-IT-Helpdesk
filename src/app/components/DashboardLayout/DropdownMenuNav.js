"use client";

import { useEffect, useState } from "react";
import React from "react";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useLoading } from "@/contexts/LoadingContext";


const DropdownMenu = ({ isOpen, onClose, handleLogout }) => {

  const { loading, showLoading, hideLoading } = useLoading();
  const router = useRouter();



  const handleClick = () => {
    showLoading(); // เริ่มการโหลดเมื่อคลิก
    router.push("/profile"); // ไปที่หน้าโปรไฟล์
  };

  useEffect(() => {
    const handleRouteChange = (url) => {
      if (url === "/profile") {
        hideLoading(); // หยุดโหลดเมื่อไปหน้าโปรไฟล์
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [hideLoading, router.events]);  // ลำดับของ dependencies คงที่ในทุกๆ การรีเรนเดอร์




  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50">
      <ul className="py-2">
        <li>
          <Link href="/profile"
            className="flex items-center px-4 py-2 w-full text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={handleClick}
          >
            <FaUser className="mr-2" /> Profile
          </Link>
        </li>
        <li>
          <button
            className="flex items-center px-4 py-2 w-full text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="mr-2" /> Sign Out
          </button>
        </li>
      </ul>
    </div>
  );
};

export default DropdownMenu;
