"use client";

import { useState } from "react";
import { useSidebarContext } from "./SidebarContext";
import {
  FaTachometerAlt,
  FaTasks,
  FaClipboardList,
  FaCheckCircle,
  FaPlus,
} from "react-icons/fa";
import Image from "next/image";

export default function Sidebar({ activeMenu, setActiveMenu }) {
  const { isSidebarOpen, toggleSidebar } = useSidebarContext();
  const [activeItem, setActiveItem] = useState("Dashboard");

  return (
    <div
      className={`bg-gray-800 h-screen transition-all duration-300 flex flex-col ${
        isSidebarOpen ? "w-64" : "w-16"
      }`}
    >
      {/* Logo Section */}
      <div
        className={`flex items-center ${
          isSidebarOpen ? "justify-start px-4" : "justify-center"
        } py-6`}
      >
        <Image
          src="/asset/png/bg-spc.png"
          alt="Company Logo"
          width={40}
          height={40}
        />
        {isSidebarOpen && (
          <span className="ml-4 text-white text-xl font-bold">Supornchai</span>
        )}
      </div>

      {/* Menu Items */}
      <ul className="flex-1 flex flex-col justify-start items-stretch space-y-2 mt-2">
        {[
          { name: "Dashboard", icon: FaTachometerAlt },
          { name: "Create Task", icon: FaPlus },
          { name: "Pending Tasks", icon: FaClipboardList },
          { name: "In Progress Tasks", icon: FaTasks },
          { name: "Completed Tasks", icon: FaCheckCircle },
          { name: "All Tasks", icon: FaClipboardList },
        ].map((menu, index) => (
          <li key={index}>
            <a
              href="#"
              onClick={() => {
                setActiveMenu(menu.name); // ใช้ setActiveMenu สำหรับการเปลี่ยนเนื้อหา
                setActiveItem(menu.name);
              }}
              className={`flex items-center ${
                isSidebarOpen ? "justify-start" : "justify-center"
              } px-4 py-3 rounded-md transition-all duration-300 ${
                activeItem === menu.name
                  ? "bg-blue-500 text-white"
                  : "text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <menu.icon
                size={20}
                className={`${
                  activeItem === menu.name ? "text-white" : "text-gray-400"
                }`}
              />
              {isSidebarOpen && (
                <span
                  className={`ml-4 text-sm font-semibold ${
                    activeItem === menu.name
                      ? "text-white"
                      : "group-hover:text-gray-300"
                  }`}
                >
                  {menu.name}
                </span>
              )}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
