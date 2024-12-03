import React from "react";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import Link from "next/link";

const DropdownMenu = ({ isOpen, onClose, handleLogout }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50">
      <ul className="py-2">
        <li>
        <Link href="/profile"
            className="flex items-center px-4 py-2 w-full text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={onClose}
          >
            <FaUser className="mr-2" /> Profile
          </Link>
        </li>
        <li>
          <button
            className="flex items-center px-4 py-2 w-full text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="mr-2" /> Sign Out
          </button>
        </li>
      </ul>
    </div>
  );
};

export default DropdownMenu;
