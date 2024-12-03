"use client";

import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  // อ่านสถานะจาก Cookies แทน localStorage
  const [isSidebarOpen, setSidebarOpen] = useState(() => {
    const savedState = Cookies.get("isSidebarOpen");
    return savedState ? savedState === "true" : true; // ค่าเริ่มต้นเป็น true
  });

  // บันทึกค่า isSidebarOpen ลงใน Cookies ทุกครั้งที่มีการเปลี่ยนแปลง
  useEffect(() => {
    Cookies.set("isSidebarOpen", isSidebarOpen, { expires: 7 }); // เก็บไว้ 7 วัน
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => {
      console.log("Toggling Sidebar:", !prev);
      return !prev;
    });
  };

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar, activeMenu, setActiveMenu }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebarContext() {
  return useContext(SidebarContext);
}
