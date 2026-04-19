"use client";

import { useState, useEffect } from "react";
import withAuth from "../../hoc/withAuth";
import Sidebar from "../components/DashboardLayout/Sidebar";
import Navbar from "../components/DashboardLayout/Navbar";
import { useTheme } from "../../contexts/ThemeContext";
import { useSidebarContext } from "../../contexts/SidebarContext";
import PendingTasksContent from "../components/ItJob/PendingTasksContent";
import InProgressTasksContent from "../components/ItJob/InProgressTasksContent";
import { useUser } from "@/contexts/UserContext";
import DashboardTameWoek from './../components/IT-TameWork/Dashboard-TameWoek';
import ProjectList from "../components/IT-TameWork/ProjectList";
import ScrumBoard from "../components/IT-TameWork/ScrumBoard"
import Issue from "../components/IT-TameWork/Issue"

const ITTameWork = () => {
  const { activeMenu } = useSidebarContext();
  //console.log("Active Menu in Page.js:", activeMenu);

  const renderContent = () => {
    switch (activeMenu) {
      case "Dashboard TameWork":
        return <DashboardTameWoek />;
      case "Project List":
        return <ProjectList />;
      case "Scrum Board":
        return <ScrumBoard />;
      case "Issue":
        return <Issue />;
      default:
        return <DashboardTameWoek />;
    }
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1">{renderContent()}</div>
    </div>
  );

};


export default withAuth(ITTameWork, ["admin","superadmin"]);