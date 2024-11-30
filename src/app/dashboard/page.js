"use client";

import { useState } from "react";
import { SidebarProvider } from "../components/SidebarContext";
import withAuth from "../../hoc/withAuth";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useTheme } from "../../contexts/ThemeContext";

const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const { theme } = useTheme();

  const renderContent = () => {
    switch (activeMenu) {
      case "Dashboard":
        return <DashboardContent />;
      case "Create Task":
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
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
  
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Navbar */}
          <Navbar />
  
          {/* Content */}
          <main className="flex-1 overflow-y-auto p-4 bg-gray-100">
            {renderContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
  
};

/* Content Components */
const DashboardContent = () => {
  const { theme } = useTheme();

  console.log("Current Theme Color:", theme.primaryColor);
  console.log("Current Theme Weight:", theme.primaryWeight);

  return (
    <div
    className=''
    >
      <div className="p-6 rounded-lg shadow-lg bg-white dark:bg-gray-700 text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Theme Test Page
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          This page demonstrates the selected theme and weight in action.
        </p>
        <div
          className={`p-4 rounded-md ${
            theme.primaryColor && theme.primaryWeight
              ? `${theme.primaryColor}-${theme.primaryWeight}`
              : "bg-gray-300"
          }`}
        >
          <span className="text-white font-semibold">
            {theme.primaryColor && theme.primaryWeight
              ? `Current Theme: ${theme.primaryColor}-${theme.primaryWeight}`
              : "No Theme Selected"}
          </span>
        </div>
      </div>
    </div>
  );
};





const CreateTaskContent = () => (
  <div>
    <h1 className="text-2xl font-bold">Create Task</h1>
    <p>Here you can create a new task.</p>
  </div>
);

const PendingTasksContent = () => (
  <div>
    <h1 className="text-2xl font-bold">Pending Tasks</h1>
    <p>View all your pending tasks here.</p>
  </div>
);

const InProgressTasksContent = () => (
  <div>
    <h1 className="text-2xl font-bold">In Progress Tasks</h1>
    <p>Check the tasks that are currently in progress.</p>
  </div>
);

const CompletedTasksContent = () => (
  <div>
    <h1 className="text-2xl font-bold">Completed Tasks</h1>
    <p>View all your completed tasks here.</p>
  </div>
);

const AllTasksContent = () => (
  <div>
    <h1 className="text-2xl font-bold">All Tasks</h1>
    <p>View all tasks regardless of their status.</p>
  </div>
);

export default withAuth(Dashboard, ["admin", "user"]);
