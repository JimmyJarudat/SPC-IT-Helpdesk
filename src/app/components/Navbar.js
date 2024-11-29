"use client";

import { useSidebarContext } from "./SidebarContext";

export default function Navbar() {
  const { toggleSidebar } = useSidebarContext();

  return (
    <nav className="h-16 bg-white shadow-md flex items-center px-4">
      <button
        onClick={toggleSidebar}
        className="text-xl p-2 rounded-md focus:outline-none"
      >
        ☰
      </button>
      <h1 className="ml-4 text-lg font-bold">Dashboard</h1>
    </nav>
  );
}
