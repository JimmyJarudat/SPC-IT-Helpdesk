"use client";

import { useUser } from "../contexts/UserContext";
import Image from "next/image";

const HomePage = () => {
  const { user, logout } = useUser(); // ดึงข้อมูลผู้ใช้จาก UserContext

  const handleLogout = async () => {
    try {
      await logout(); // เรียกฟังก์ชัน Logout
      alert("You have logged out successfully.");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Welcome to the Home Page</h1>
      {user ? (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">User Information:</h2>
          <p><strong>Full Name:</strong> {user.username}</p>
          <p><strong>Username:</strong> {user.fullName}</p>
          <p><strong>สิทธิ์:</strong> {user.role}</p>
          <p><strong>สถานะแอดเค้า:</strong> {user.role_status}</p>
          <p><strong>บริษัท:</strong> {user.company}</p>
          <p><strong>แผนก:</strong> {user.department}</p>
          <p><strong>อีเมล:</strong> {user.email}</p>
          <p><strong>รหัสพนักงาน:</strong> {user.employeeID}</p>
          <p><strong>ชื่อเล่น:</strong> {user.nickName}</p>
          <p><strong>เบอร์:</strong> {user.phone}</p>
          <Image
            src={user?.profileImage || "https://picsum.photos/200/300"}
            alt="User Avatar"
            className="w-8 h-8 rounded-full"
            width={32}
            height={32}
          />
          <button
            onClick={handleLogout}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="mt-4">
          <p>You are not logged in.</p>
          <a
            href="/login"
            className="text-blue-500 underline hover:text-blue-700"
          >
            Go to Login
          </a>
        </div>
      )}
    </div>
  );
};

export default HomePage;
