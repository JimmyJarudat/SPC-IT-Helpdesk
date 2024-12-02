"use client";

import { createContext, useContext, useState, useEffect } from "react";

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  // ดึงค่า isSidebarOpen จาก localStorage เมื่อโหลดครั้งแรก
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSidebarState = localStorage.getItem("isSidebarOpen");
      if (savedSidebarState !== null) {
        setSidebarOpen(savedSidebarState === "true");
      }
    }
  }, []);

  // บันทึกค่า isSidebarOpen ลงใน localStorage ทุกครั้งที่ค่าเปลี่ยน
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("isSidebarOpen", isSidebarOpen);
    }
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
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
