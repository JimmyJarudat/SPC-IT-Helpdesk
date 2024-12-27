"use client";

import { useState, useEffect } from "react";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useUser } from "../../../contexts/UserContext";
import UserSidebar from "./UserSidebar";

const DashboardLayout = ({ children }) => {
  const { user, isLoading } = useUser();
  const [activeMenu, setActiveMenu] = useState("Dashboard");


  if (isLoading) return <div>Loading...</div>; // Loading State

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      
      {user?.role === "admin" || user?.role === "superadmin" ? <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} /> : <UserSidebar />}
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar  />

        {/* Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
