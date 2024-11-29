"use client";

import { SidebarProvider } from "../components/SidebarContext";
import withAuth from '../../hoc/withAuth';
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="p-4">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p>Welcome to the dashboard! Here's your overview.</p>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
export default withAuth(Dashboard, ['admin', 'user']);
 
