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
  FaUserCog,
} from "react-icons/fa";
import { MdOutlinePendingActions } from "react-icons/md";
import { SiProgress } from "react-icons/si";
import Image from "next/image";
import { useTheme } from "@/contexts/ThemeContext";
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';

export default function Sidebar() {
  const { theme } = useTheme();
  const { isSidebarOpen, activeMenu, setActiveMenu } = useSidebarContext();
  const [activeItem, setActiveItem] = useState();
  const [isJobMenuOpen, setIsJobMenuOpen] = useState(false);
  const [isITTameMenuOpen, setIsITTameMenuOpen] = useState(false);
  const [jobPageLoading, setJobPageLoading] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const jobMenuItems = [
    { name: "Dashboard", urlPath: "dashboard", icon: FaTachometerAlt },
    { name: "Create JOB", urlPath: "create-job", icon: FaPlus },
    { name: "Pending Tasks", urlPath: "pending-tasks", icon: MdOutlinePendingActions },
    { name: "In Progress Tasks", urlPath: "in-progress-tasks", icon: SiProgress },
    { name: "Completed Tasks", urlPath: "completed-tasks", icon: FaCheckCircle },
    { name: "All Tasks", urlPath: "all-tasks", icon: FaClipboardList }
  ];

  const handleMenuClick = (path, item) => {
    if (path === '/it-job') {
      // กรณีอยู่ในหน้า it-job
      const menuItem = jobMenuItems.find(menu => menu.name === item);
      if (menuItem) {
        if (pathname === `/it-job/${menuItem.urlPath}`) {
          // ถ้าอยู่ในหน้าเดียวกัน ไม่ต้องแสดง loading
          setJobPageLoading(false);
        } else {
          // ถ้าเป็นแท็บอื่นใน it-job ให้แสดง loading
          setJobPageLoading(true);
          router.push(`/it-job/${menuItem.urlPath}`);
        }
      }
    } else {
      // กรณีนำทางไปหน้าอื่น
      if (pathname === path) {
        setJobPageLoading(false);
      } else {
        setJobPageLoading(true);
        router.push(path);
      }
    }
    
    // อัปเดต state ของเมนูเสมอเมื่อมีการคลิก
    setActiveItem(item);
    setActiveMenu(item);
  };
  
  // เพิ่ม useEffect เพื่อจัดการ loading state เมื่อ pathname เปลี่ยน
  useEffect(() => {
    setJobPageLoading(false);
  }, [pathname]);



  const ITTameWorkMenuItems = [
    { name: "Dashboard TameWork ", icon: FaTachometerAlt }, // เปลี่ยนชื่อให้ไม่ซ้ำ
    { name: "Project List", icon: FaPlus },
    { name: "Scrum Board", icon: MdOutlinePendingActions },
    { name: "Issue", icon: SiProgress },
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
                  onClick={() => handleMenuClick("/it-job", menu.name)} // ใช้ฟังก์ชัน handleMenuClick
                  className={`flex items-center justify-start px-4 py-2 rounded-md transition-all duration-300 ${activeItem === menu.name
                    ? `bg-${theme.primaryColor.split("-")[1]}-${theme.primaryWeight} text-white`
                    : `text-gray-700 dark:text-gray-400 hover:bg-${theme.primaryColor.split("-")[1]}-${theme.primaryWeight} hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-white`
                    }`}
                >
                  <menu.icon
                    size={18}
                    className={`${activeItem === menu.name
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
        <div className="absolute left-full top-1 mt-[120px] z-50 hidden group-hover:block transition-all duration-300">
          <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs rounded shadow-lg p-2">
            <ul className="py-2 whitespace-nowrap">
              {jobMenuItems.map((menu, index) => (
                <li
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation(); // ป้องกัน Event อื่นที่ไม่เกี่ยวข้อง
                    handleMenuClick("/it-job", menu.name); // เรียก handleMenuClick เพื่อเปลี่ยน URL และอัปเดต Context
                  }}
                  className={`px-4 py-2 rounded-md cursor-pointer transition-all duration-300 ${activeItem === menu.name
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

  const renderITTameWorkSubmenu = () => {
    if (isSidebarOpen) {
      return (
        isITTameMenuOpen && (
          <ul className="mt-2 space-y-1 pl-6">
            {ITTameWorkMenuItems.map((menu, index) => (
              <li key={index}>
                <a
                  href="#"
                  onClick={() => {
                    setActiveMenu(menu.name);
                    setActiveItem(menu.name);
                  }}
                  className={`flex items-center justify-start px-4 py-2 rounded-md transition-all duration-300 ${activeItem === menu.name
                    ? `bg-${theme.primaryColor.split("-")[1]}-${theme.primaryWeight} text-white`
                    : `text-gray-700 dark:text-gray-400 hover:bg-${theme.primaryColor.split("-")[1]}-${theme.primaryWeight} hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-white`
                    }`}
                >
                  <menu.icon
                    size={18}
                    className={`${activeItem === menu.name
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
        <div className="absolute left-full top-0 mt-[179px] z-50 hidden group-hover:block transition-all duration-300">
          <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs rounded shadow-lg p-2">
            <ul className="py-2 whitespace-nowrap">
              {ITTameWorkMenuItems.map((menu, index) => (
                <li
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenu(menu.name);
                    setActiveItem(menu.name);
                  }}
                  className={`px-4 py-2 rounded-md cursor-pointer transition-all duration-300 ${activeItem === menu.name
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
      className={`  bg-white-50 dark:bg-gray-900 h-screen transition-all duration-300 flex flex-col overflow-visible relative ${isSidebarOpen ? "w-64" : "w-16"
        }`}
    >
      {/* Logo Section */}
      <div
        className={`flex items-center ${isSidebarOpen ? "justify-start px-4" : "justify-center"
          } py-6`}
      >
        <Link href="/">
          <Image
            src="/asset/png/bg-j.ico"
            alt="Company Logo"
            width={40}
            height={40}
            className="cursor-pointer"
          />
        </Link>
        {isSidebarOpen && (
          <Link href="/">
            <span className="ml-4 text-gray-800 dark:text-gray-200 text-xl font-bold">
              Jarudat
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
      <ul className="flex flex-col justify-start items-stretch space-y-2 mt-2 group">
        <li>
          <div
            onClick={() => {
              handleMenuClick("/it-job/dashboard", "Jobs Overview"); // ใช้ handleMenuClick สำหรับ URL และ Context
              if (isSidebarOpen) {
                setIsJobMenuOpen(!isJobMenuOpen); // เปิด/ปิดเมนูย่อย
              }
            }}
            className={`relative flex items-center ${isSidebarOpen ? "justify-start" : "justify-center"
              } px-4 py-3 rounded-md cursor-pointer transition-all duration-300 ${activeItem === "JOB" || jobMenuItems.some((menu) => menu.name === activeItem)
                ? `bg-${theme.primaryColor.split("-")[1]}-${theme.primaryWeight} text-white`
                : `text-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700`
              }`}
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
            {isSidebarOpen && (
              <button
                onClick={(e) => {
                  e.stopPropagation(); // หยุด Event คลิกจากกระจายไปยังเมนูอื่น
                  setIsJobMenuOpen(!isJobMenuOpen); // เปิด/ปิดเมนูย่อย
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


      {/* IT-Tame Work */}
      <ul className="flex flex-col justify-start items-stretch space-y-2 mt-2 group">
        <li>
          <div
            onClick={() => {
              handleMenuClick("/IT-TameWork");
              if (isSidebarOpen) {
                setIsJobMenuOpen(!isJobMenuOpen); // สลับสถานะของเมนูย่อย
              }
              setActiveMenu("TameWork Overview");
              setActiveItem("TameWork");
            }}
            className={`relative flex items-center ${isSidebarOpen ? "justify-start" : "justify-center"
              } px-4 py-3 rounded-md cursor-pointer transition-all duration-300 ${activeItem === "TameWork" || ITTameWorkMenuItems.some((menu) => menu.name === activeItem)
                ? `bg-${theme.primaryColor.split("-")[1]}-${theme.primaryWeight} text-white`
                : `text-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700`
              }`}
            title={isSidebarOpen ? "" : "IT - TameWork"}
          >
            <Link href="/IT-TameWork">
              <div
                className="flex items-center w-full"
                onClick={() => {
                  handleMenuClick("/IT-TameWork");
                  if (isSidebarOpen) {
                    setIsJobMenuOpen(!isJobMenuOpen);
                  }
                  setActiveMenu("TameWork Overview");
                  setActiveItem("TameWork");
                }}
                title={isSidebarOpen ? "" : "IT - TameWork"}
              >
                <FaTasks
                  size={20}
                  className={`${activeItem === "TameWork" || ITTameWorkMenuItems.some((menu) => menu.name === activeItem)
                    ? "text-white"
                    : "text-gray-700 dark:text-gray-400"
                    }`}
                />
                {isSidebarOpen && (
                  <span className="ml-4 text-sm font-semibold">IT - TameWork</span>
                )}
              </div>
            </Link>
            {isSidebarOpen && (
              <button
                onClick={(e) => {
                  e.stopPropagation(); // หยุดไม่ให้ Event หลักถูกกระตุ้น
                  setIsITTameMenuOpen(!isITTameMenuOpen); // สลับสถานะเปิด/ปิดเมนูย่อย
                }}
                className="ml-auto text-gray-700 dark:text-gray-400 hover:text-white focus:outline-none"
              >
                {isITTameMenuOpen ? <FaChevronDown /> : <FaChevronRight />}
              </button>

            )}
          </div>

          {/* Render IT-Tame Work Submenu */}
          {renderITTameWorkSubmenu()}
        </li>
      </ul>


      <ul className="flex flex-col space-y-2 mt-2">
        <li>
          <Link href="/user-management">
            <div
              onClick={() => {
                handleMenuClick("/user-management");
                setActiveMenu("User Management"); // อัปเดต activeMenu สำหรับเมนูหลัก
                setActiveItem("User Management");
              }}
              className={`relative flex items-center ${isSidebarOpen ? "justify-start" : "justify-center"
                } px-4 py-3 rounded-md cursor-pointer transition-all duration-300 ${activeItem === "User Management"
                  ? `bg-${theme.primaryColor.split("-")[1]}-${theme.primaryWeight} text-white`
                  : `text-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700`
                }`}
            >
              <FaUserCog
                onClick={() => {
                  handleMenuClick("/user-management");
                  setActiveMenu("User Management"); // อัปเดต activeMenu สำหรับเมนูหลัก
                  setActiveItem("User Management");
                }}
                size={20}
                className={`${activeItem === "User Management"
                  ? "text-white"
                  : "text-gray-700 dark:text-gray-400"
                  }`}
              />
              {isSidebarOpen && (
                <span className="ml-4 text-sm font-semibold">User Management</span>
              )}
            </div>
          </Link>
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
