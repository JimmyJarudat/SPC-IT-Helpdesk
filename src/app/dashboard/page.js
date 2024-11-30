"use client";

import { useState } from "react";
import { SidebarProvider } from "../components/SidebarContext";
import withAuth from "../../hoc/withAuth";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState("Dashboard");

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
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="p-4">{renderContent()}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

/* Content Components */
const DashboardContent = () => (
  <div>
    <h1 className="text-2xl font-bold">Dashboard</h1>
    <p>Welcome to the dashboard!</p>
  </div>
);

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
