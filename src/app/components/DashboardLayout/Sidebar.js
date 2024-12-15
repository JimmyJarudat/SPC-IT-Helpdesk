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
import { useTheme } from "@/contexts/ThemeContext";
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';

export default function Sidebar() {
  const { theme } = useTheme();
  const { isSidebarOpen, activeMenu, setActiveMenu } = useSidebarContext();
  const [activeItem, setActiveItem] = useState();
  const [isJobMenuOpen, setIsJobMenuOpen] = useState(false);
  const [jobPageLoading, setJobPageLoading] = useState(false);

  const router = useRouter();
  const pathname = usePathname();


  const handleMenuClick = (path, item) => {
    if (pathname === path) {
      setJobPageLoading(false); // หากอยู่ในหน้าเดิม
    } else {
      setJobPageLoading(true);
      router.push(path);
    }
    setActiveItem(item); // ตั้งค่า activeItem เมื่อคลิก
  };

  useEffect(() => {
    setJobPageLoading(false); // เรียก hideLoading ทุกครั้งที่ pathname เปลี่ยน
  }, [pathname]);


  useEffect(() => {
    if (pathname) {
      switch (true) {
        case pathname.includes("/overview"):
          setActiveItem("Overview");
          break;
        case pathname.includes("/it-job"):
          setActiveItem("JOB");
          break;
        default:
          setActiveItem(""); // Clear active if no matching path
      }
    }
  }, [pathname]);


  const jobMenuItems = [
    { name: "Dash Board", icon: FaPlus },
    { name: "Create JOB", icon: FaPlus },
    { name: "Pending Tasks", icon: FaClipboardList },
    { name: "In Progress Tasks", icon: FaTasks },
    { name: "Completed Tasks", icon: FaCheckCircle },
    { name: "All Tasks", icon: FaClipboardList },
  ];

  const renderJobSubmenu = () => {
    if (
      activeItem === "JOB" || 
      (jobMenuItems.some((menu) => menu.name === activeItem) && isSidebarOpen)
    ) {
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
                      ? `bg-${theme.primaryColor.split("-")[1]}-${theme.primaryWeight} text-white`
                      : `text-gray-700 dark:text-gray-400 hover:bg-${theme.primaryColor.split("-")[1]}-${theme.primaryWeight} hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-white`
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
    } else if (activeItem === "JOB" || 
      (jobMenuItems.some((menu) => menu.name === activeItem) && !isSidebarOpen)) {
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
    return null;
  };
  

  return (
    <div
      className={`bg-white-50 dark:bg-gray-900 h-screen transition-all duration-300 flex flex-col overflow-visible relative ${isSidebarOpen ? "w-64" : "w-16"
        }`}
    >
      {/* Logo Section */}
      <div
        className={`flex items-center ${isSidebarOpen ? "justify-start px-4" : "justify-center"
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
          <Link href="/overview">
            <div
              onClick={() => {
                handleMenuClick("/overview");
                setActiveMenu("Overview"); // อัปเดต activeMenu สำหรับเมนูหลัก
                setActiveItem("Overview");
              }}
              className={`relative flex items-center ${isSidebarOpen ? "justify-start" : "justify-center"
                } px-4 py-3 rounded-md cursor-pointer transition-all duration-300 ${activeItem === "Overview"
                  ? `bg-${theme.primaryColor.split("-")[1]}-${theme.primaryWeight} text-white`
                  : `text-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700`
                }`}
            >
              <FaTachometerAlt
                onClick={() => {
                  handleMenuClick("/overview");
                  setActiveMenu("Overview"); // อัปเดต activeMenu สำหรับเมนูหลัก
                  setActiveItem("Overview");
                }}
                size={20}
                className={`${activeItem === "Overview"
                  ? "text-white"
                  : "text-gray-700 dark:text-gray-400"
                  }`}
              />
              {isSidebarOpen && (
                <span className="ml-4 text-sm font-semibold">Overview</span>
              )}
            </div>
          </Link>
        </li>
      </ul>

      {/* JOB Menu */}
      <ul className="flex-1 flex flex-col justify-start items-stretch space-y-2 mt-4 group">
        <li>
          <div
            onClick={() => {
              handleMenuClick("/it-job");
              if (isSidebarOpen) {
                setIsJobMenuOpen(!isJobMenuOpen);
              }
              setActiveMenu("Jobs Overview");
              setActiveItem("JOB");
            }}
            className={`relative flex items-center ${isSidebarOpen ? "justify-start" : "justify-center"
              } px-4 py-3 rounded-md cursor-pointer transition-all duration-300 ${activeItem === "JOB" || jobMenuItems.some((menu) => menu.name === activeItem)
                ? `bg-${theme.primaryColor.split("-")[1]}-${theme.primaryWeight} text-white`
                : `text-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700`
              }`}
            title={isSidebarOpen ? "" : "IT - JOB"}
          >
            <Link href="/it-job">
              <div
                className="flex items-center w-full"
                onClick={() => {
                  handleMenuClick("/it-job");
                  if (isSidebarOpen) {
                    setIsJobMenuOpen(!isJobMenuOpen);
                  }
                  setActiveMenu("Jobs Overview");
                  setActiveItem("JOB");
                }}
                title={isSidebarOpen ? "" : "IT - JOB"}
              >
                <FaTasks
                  size={20}
                  className={`${activeItem === "JOB" || jobMenuItems.some((menu) => menu.name === activeItem)
                    ? "text-white"
                    : "text-gray-700 dark:text-gray-400"
                    }`}
                />
                {isSidebarOpen && (
                  <span className="ml-4 text-sm font-semibold">IT - JOB</span>
                )}
              </div>
            </Link>
            {isSidebarOpen && (
              <button
                onClick={(e) => {
                  e.stopPropagation(); // หยุดไม่ให้ Event หลักถูกกระตุ้น
                  setIsJobMenuOpen(!isJobMenuOpen); // สลับสถานะเปิด/ปิดเมนูย่อย
                }}
                className="ml-auto text-gray-700 dark:text-gray-400 hover:text-white focus:outline-none"
              >
                {isJobMenuOpen ? <FaChevronDown /> : <FaChevronRight />}
              </button>
            )}
          </div>

          {/* Render JOB submenu */}
          {renderJobSubmenu()}
        </li>
      </ul>




      {jobPageLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-900 bg-opacity-50 z-50">
          <div className="flex flex-col items-center space-y-4">
            {/* วงกลมเต้น */}
            <div className="relative w-12 h-12">
              <span className="absolute w-full h-full rounded-full border-4 border-t-transparent border-blue-500 dark:border-blue-300 animate-ping"></span>
              <span className="absolute w-full h-full rounded-full border-4 border-blue-500 dark:border-blue-300"></span>
            </div>
            {/* ข้อความ */}
            <span className="text-gray-900 dark:text-gray-100 text-lg font-medium">
              กำลังเปลี่ยนหน้า...
            </span>
          </div>
        </div>
      )}







    </div>
  );
}
