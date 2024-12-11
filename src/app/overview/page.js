"use client";







import { useUser } from "@/contexts/UserContext";
import { useEffect } from "react";

export default function AnotherPage() {
  const { fetchProfile, user, isLoading } = useUser();  // นำเข้า fetchProfile จาก context

  useEffect(() => {
    // เรียกใช้ fetchProfile เมื่อคอมโพเนนต์นี้โหลด
    if (user) {
      fetchProfile(); // เรียกใช้ฟังก์ชันที่ดึงข้อมูล
    }
  }, [user, fetchProfile]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.fullName}</h1>
      {/* แสดงข้อมูลโปรไฟล์หรือรูปภาพ */}
    </div>
  );
}
