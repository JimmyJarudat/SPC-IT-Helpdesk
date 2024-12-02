import { FaTachometerAlt, FaClipboardList, FaCog } from "react-icons/fa";
import Link from "next/link";

export default function UserSidebar() {
  return (
    <div className="bg-white-50 dark:bg-gray-900 h-screen transition-all duration-300 flex flex-col overflow-visible relative w-64">
      {/* User Menu */}
      <ul className="flex flex-col space-y-2 mt-4">
        <li>
          <Link href="/dashboard">
            <div className="relative flex items-center justify-start px-4 py-3 rounded-md cursor-pointer transition-all duration-300 text-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
              <FaTachometerAlt size={20} />
              <span className="ml-4 text-sm font-semibold">User Dashboard</span>
            </div>
          </Link>
        </li>
        <li>
          <Link href="/tasks">
            <div className="relative flex items-center justify-start px-4 py-3 rounded-md cursor-pointer transition-all duration-300 text-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
              <FaClipboardList size={20} />
              <span className="ml-4 text-sm font-semibold">My Tasks</span>
            </div>
          </Link>
        </li>
        <li>
          <Link href="/settings">
            <div className="relative flex items-center justify-start px-4 py-3 rounded-md cursor-pointer transition-all duration-300 text-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
              <FaCog size={20} />
              <span className="ml-4 text-sm font-semibold">Settings</span>
            </div>
          </Link>
        </li>
      </ul>
    </div>
  );
}
