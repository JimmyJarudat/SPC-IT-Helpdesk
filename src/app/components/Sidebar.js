"use client";

import { useState } from "react";
import { useSidebarContext } from "./SidebarContext";
import {
  FaTachometerAlt,
  FaTasks,
  FaClipboardList,
  FaCheckCircle,
  FaPlus,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";
import Image from "next/image";
import { useTheme } from "../../contexts/ThemeContext"; // นำ useTheme มาใช้
import Link from "next/link";

export default function Sidebar({ activeMenu, setActiveMenu }) {
  const { theme } = useTheme();
  const { isSidebarOpen } = useSidebarContext();

  const [activeItem, setActiveItem] = useState("Dashboard");
  const [isJobMenuOpen, setIsJobMenuOpen] = useState(false); // ควบคุมการเปิด/ปิดเมนู JOB

  return (
    <div
      className={`bg-white-50 dark:bg-gray-900 h-screen transition-all duration-300 flex flex-col overflow-hidden ${
        isSidebarOpen ? "w-64" : "w-16"
      }`}
    >
      {/* Logo Section */}
      <div
        className={`flex items-center ${
          isSidebarOpen ? "justify-start px-4" : "justify-center"
        } py-6`}
      >
        <Link href="/">
          <Image
            src="/asset/png/bg-spc.png"
            alt="Company Logo"
            width={40}
            height={40}
            className="cursor-pointer"
          />
        </Link>
        {isSidebarOpen && (
          <Link href="/">
            <span className="ml-4 text-gray-800 dark:text-gray-200 text-xl font-bold">
              Supornchai
            </span>
          </Link>
        )}
      </div>

      {/* Dashboard Menu */}
      <ul className="flex flex-col space-y-2">
        <li>
          <div
            onClick={() => {
              setActiveMenu("Dashboard");
              setActiveItem("Dashboard");
            }}
            className={`relative flex items-center ${
              isSidebarOpen ? "justify-start" : "justify-center"
            } px-4 py-3 rounded-md cursor-pointer transition-all duration-300 ${
              activeItem === "Dashboard"
                ? `bg-${theme.primaryColor.split("-")[1]}-${
                    theme.primaryWeight
                  } text-white`
                : `text-gray-700 dark:text-gray-400 hover:bg-${
                    theme.primaryColor.split("-")[1]
                  }-${theme.primaryWeight} hover:text-white`
            }`}
          >
            <FaTachometerAlt
              size={20}
              className={`${
                activeItem === "Dashboard"
                  ? "text-white"
                  : "text-gray-700 dark:text-gray-400"
              }`}
            />
            {isSidebarOpen && (
              <span className="ml-4 text-sm font-semibold">Dashboard</span>
            )}
            {!isSidebarOpen && (
              <span className="absolute left-full ml-2 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg hidden group-hover:block">
                Dashboard
              </span>
            )}
          </div>
        </li>
      </ul>

      {/* JOB Menu */}
      <ul className="flex-1 flex flex-col justify-start items-stretch space-y-2 mt-4">
        <li>
          <div
            onClick={() => setIsJobMenuOpen(!isJobMenuOpen)}
            className={`relative flex items-center ${
              isSidebarOpen ? "justify-start" : "justify-center"
            } px-4 py-3 rounded-md cursor-pointer transition-all duration-300 ${
              activeItem === "JOB"
                ? `bg-${theme.primaryColor.split("-")[1]}-${
                    theme.primaryWeight
                  } text-white`
                : `text-gray-700 dark:text-gray-400 hover:bg-${
                    theme.primaryColor.split("-")[1]
                  }-${theme.primaryWeight} hover:text-white`
            }`}
          >
            <FaTasks
              size={20}
              className={`${
                activeItem === "JOB"
                  ? "text-white"
                  : "text-gray-700 dark:text-gray-400"
              }`}
            />


            
            {isSidebarOpen && (
              <span className="ml-4 text-sm font-semibold">JOB</span>
            )}
            {isSidebarOpen && (
              <span className="ml-auto">
                {isJobMenuOpen ? <FaChevronDown /> : <FaChevronRight />}
              </span>
            )}
            {!isSidebarOpen && (
              <span className="absolute left-full ml-2 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg hidden group-hover:block">
                JOB
              </span>
            )}
          </div>
          {/* Submenu for JOB */}
          {isJobMenuOpen && (
            <ul
              className={`mt-2 space-y-1 pl-6 ${
                isSidebarOpen ? "block" : "hidden"
              }`}
            >
              {[
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
                      setActiveMenu(menu.name);
                      setActiveItem(menu.name);
                    }}
                    className={`flex items-center ${
                      isSidebarOpen
                        ? "justify-start"
                        : "justify-center"
                    } px-4 py-2 rounded-md transition-all duration-300 ${
                      activeItem === menu.name
                        ? `bg-${theme.primaryColor.split("-")[1]}-${
                            theme.primaryWeight
                          } text-white`
                        : `text-gray-700 dark:text-gray-400 hover:bg-${
                            theme.primaryColor.split("-")[1]
                          }-${theme.primaryWeight} hover:text-white`
                    }`}
                  >
                    <menu.icon
                      size={18}
                      className={`${
                        activeItem === menu.name
                          ? "text-white"
                          : "text-gray-700 dark:text-gray-400"
                      }`}
                    />
                    {isSidebarOpen && (
                      <span className="ml-4 text-sm font-semibold">
                        {menu.name}
                      </span>
                    )}
                    {!isSidebarOpen && (
                      <span className="absolute left-full ml-2 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg hidden group-hover:block">
                        {menu.name}
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </li>
      </ul>
      
    </div>
  );
}
