"use client";

import { useSidebarContext } from "./SidebarContext";

export default function Sidebar() {
  const { isSidebarOpen } = useSidebarContext();

  return (
    <div
      className={`bg-red-500 h-full transition-all duration-300 ${
        isSidebarOpen ? "w-64" : "w-16"
      }`}
    >
      <ul className="p-4">
        <li className="text-white py-2">Home</li>
        <li className="text-white py-2">Dashboard</li>
        <li className="text-white py-2">Projects</li>
      </ul>
    </div>
  );
}
