"use client";

import { useState, useEffect } from "react";
import { useSidebarContext } from "../../../contexts/SidebarContext";
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
import { useTheme } from "../../../contexts/ThemeContext";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const { theme } = useTheme();
  const { isSidebarOpen, activeMenu, setActiveMenu } = useSidebarContext();
  const [activeItem, setActiveItem] = useState();
  const [isJobMenuOpen, setIsJobMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      if (pathname.includes("/dashboard")) {
        setActiveItem("Dashboard");
      } else if (pathname.includes("/it-job")) {
        setActiveItem("JOB");
      } else {
        setActiveItem(""); // Clear active if no matching path
      }
    }
  }, [pathname]);

  const jobMenuItems = [
    { name: "Create Task", icon: FaPlus },
    { name: "Pending Tasks", icon: FaClipboardList },
    { name: "In Progress Tasks", icon: FaTasks },
    { name: "Completed Tasks", icon: FaCheckCircle },
    { name: "All Tasks", icon: FaClipboardList },
  ];

  const renderJobSubmenu = () => {
    if (isSidebarOpen) {
      return (
        isJobMenuOpen && (
          <ul className="mt-2 space-y-1 pl-6">
            {jobMenuItems.map((menu, index) => (
              <li key={index}>
                <a
                  href="#"
                  onClick={() => {
                    setActiveMenu(menu.name);
                    setActiveItem(menu.name);
                  }}
                  className={`flex items-center justify-start px-4 py-2 rounded-md transition-all duration-300 ${
                    activeItem === menu.name
                      ? `bg-${theme.primaryColor.split("-")[1]}-${
                          theme.primaryWeight
                        } text-white`
                      : `text-gray-700 dark:text-gray-400 hover:bg-${theme.primaryColor.split("-")[1]}-${
                          theme.primaryWeight
                        } hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-white`
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
                  <span className="ml-4 text-sm font-semibold">{menu.name}</span>
                </a>
              </li>
            ))}
          </ul>
        )
      );
    } else {
      return (
        <div className="absolute left-full top-1 mt-[135px] z-50 hidden group-hover:block transition-all duration-300">
          <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs rounded shadow-lg p-2">
            <ul className="py-2 whitespace-nowrap">
              {jobMenuItems.map((menu, index) => (
                <li
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenu(menu.name);
                    setActiveItem(menu.name);
                  }}
                  className={`px-4 py-2 rounded-md cursor-pointer transition-all duration-300 ${
                    activeItem === menu.name
                      ? `bg-${theme.primaryColor.split("-")[1]}-${theme.primaryWeight} text-white`
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  {menu.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    }
  };

  return (
    <div
      className={`bg-white-50 dark:bg-gray-900 h-screen transition-all duration-300 flex flex-col overflow-visible relative ${
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
          <Link href="/dashboard">
            <div
              className={`relative flex items-center ${
                isSidebarOpen ? "justify-start" : "justify-center"
              } px-4 py-3 rounded-md cursor-pointer transition-all duration-300 ${
                activeItem === "Dashboard"
                  ? `bg-${theme.primaryColor.split("-")[1]}-${theme.primaryWeight} text-white`
                  : `text-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700`
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
            </div>
          </Link>
        </li>
      </ul>

      {/* JOB Menu */}
      <ul className="flex-1 flex flex-col justify-start items-stretch space-y-2 mt-4 group">
        <li>
          <Link href="/it-job">
            <div
              onClick={() => {
                if (isSidebarOpen) {
                  setIsJobMenuOpen(!isJobMenuOpen);
                }
                setActiveMenu("Dashboard1");
                setActiveItem("JOB");
              }}
              className={`relative flex items-center ${
                isSidebarOpen ? "justify-start" : "justify-center"
              } px-4 py-3 rounded-md cursor-pointer transition-all duration-300 ${
                activeItem === "JOB" || jobMenuItems.some((menu) => menu.name === activeItem)
                  ? `bg-${theme.primaryColor.split("-")[1]}-${theme.primaryWeight} text-white`
                  : `text-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700`
              }`}
              title={isSidebarOpen ? "" : "IT - JOB"}
            >
              <FaTasks
                size={20}
                className={`${
                  activeItem === "JOB" || jobMenuItems.some((menu) => menu.name === activeItem)
                    ? "text-white"
                    : "text-gray-700 dark:text-gray-400"
                }`}
              />
              {isSidebarOpen && (
                <>
                  <span className="ml-4 text-sm font-semibold">IT - JOB</span>
                  <span className="ml-auto">
                    {isJobMenuOpen ? <FaChevronDown /> : <FaChevronRight />}
                  </span>
                </>
              )}
            </div>
          </Link>

          {/* Render JOB submenu */}
          {renderJobSubmenu()}
        </li>
      </ul>
    </div>
  );
}
