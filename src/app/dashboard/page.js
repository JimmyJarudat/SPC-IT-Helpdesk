"use client";

import { useState } from "react";
import { SidebarProvider } from "../../contexts/SidebarContext";
import withAuth from "../../hoc/withAuth";
import Sidebar from "../components/DashboardLayout/Sidebar";
import Navbar from "../components/DashboardLayout/Navbar";
import { useTheme } from "../../contexts/ThemeContext";

const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const { theme } = useTheme();


  return (
    <div>
      <h1>22222oai</h1>
    </div>
  );
  
};



export default withAuth(Dashboard, ["admin", "user"]);