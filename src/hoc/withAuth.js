"use client";

import { useUser } from '../context/UserContext'; // ใช้ UserContext ของคุณ
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Loading from '../app/components/Loading';

const withAuth = (WrappedComponent, allowedRoles = []) => {
  return (props) => {
    const { user, loading, setUser } = useUser(); // ดึงข้อมูล user, loading และ setUser จาก Context
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('token'); // ตรวจสอบ Token จาก Local Storage

      // หากไม่มี Token ให้กลับไปหน้าล็อกอิน
      if (!loading && !token) {
        router.push('/login');
        return;
      }

      // หากมี Token ให้ตรวจสอบสิทธิ์และโหลดข้อมูลผู้ใช้
      const fetchUserData = async () => {
        try {
          const res = await fetch('/api/userStatus', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!res.ok) {
            throw new Error('Failed to fetch user status');
          }

          const data = await res.json();

          // อัปเดต Context ด้วยข้อมูลผู้ใช้
          setUser({
            id: data.id,
            email: data.email,
            username: data.username,
            role: data.role,
            role_status: data.role_status,
          });

          // ตรวจสอบสถานะบัญชี
          if (data.role_status !== 'approved') {
            router.push('/pendingApproval'); // หากสถานะไม่ใช่ approved
            return;
          }

          // ตรวจสอบ Role หากไม่อยู่ใน allowedRoles
          if (!allowedRoles.includes(data.role)) {
            router.push('/unauthorized'); // หาก Role ไม่ได้รับอนุญาต
            return;
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          router.push('/login'); // หากเกิดข้อผิดพลาด ให้กลับไปหน้าล็อกอิน
        }
      };

      if (!loading && token) {
        fetchUserData();
      }
    }, [user, loading, router, setUser]);

    // Loading หรือกรณียังไม่ได้รับอนุญาต
    if (loading || !user || (user && user.role_status !== 'approved')) {
      return <Loading />; // แสดงหน้ากำลังโหลด
    }

    // แสดงคอมโพเนนต์ที่ห่อด้วย HOC
    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
