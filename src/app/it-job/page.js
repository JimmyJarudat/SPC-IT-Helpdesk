"use client";

import { useState, useEffect } from "react";
import withAuth from "../../hoc/withAuth";
import Sidebar from "../components/DashboardLayout/Sidebar";
import Navbar from "../components/DashboardLayout/Navbar";
import { useTheme } from "../../contexts/ThemeContext";
import { useSidebarContext } from "../../contexts/SidebarContext";
import CreateTaskContent from "../components/ItJob/CreateTaskContent";
import PendingTasksContent from "../components/ItJob/PendingTasksContent";
import InProgressTasksContent from "../components/ItJob/InProgressTasksContent";
import { useUser } from "@/contexts/UserContext";
import AllTasksContent from "../components/ItJob/AllTasksContent";
import CompletedTasksContent from "../components/ItJob/CompletedTasksContent";
import DashboardContent from "../components/ItJob/DashboardContent";

const itJob = () => {
  const { activeMenu } = useSidebarContext();
  //console.log("Active Menu in Page.js:", activeMenu);

  const renderContent = () => {
    switch (activeMenu) {
      case "Dashboard1":
        return <DashboardContent />;
      case "Create JOB":
        return <CreateTaskContent />;
      case "Pending Tasks":
        return <PendingTasksContent />;
      case "In Progress Tasks":
        return <InProgressTasksContent />;
      case "Completed Tasks":
        return <CompletedTasksContent />;
      case "All Tasks":
        return <AllTasksContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1">{renderContent()}</div>
    </div>
  );

};


export default withAuth(itJob, ["admin","superadmin"]);