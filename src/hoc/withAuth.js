import { useRouter } from 'next/navigation';
import { useUser } from '../contexts/UserContext';
import { useEffect } from 'react';

const withAuth = (Component, allowedRoles) => {
  return (props) => {
    const { user } = useUser();
    const router = useRouter();

    useEffect(() => {
      if (user === undefined) {
        // รอให้ข้อมูลผู้ใช้โหลดก่อน
        return;
      }

      if (!user) {
        // หากยังไม่ได้ล็อกอิน นำทางไปที่หน้าล็อกอิน
        router.replace('/login');
      } else if (!allowedRoles.includes(user.role)) {
        // หากสิทธิ์ไม่เพียงพอ นำทางไปที่หน้า Unauthorized
        router.replace('/unauthorized');
      }
    }, [user, router, allowedRoles]);

    // แสดง Loading จนกว่าจะตรวจสอบเสร็จ
    if (user === undefined || !user || !allowedRoles.includes(user.role)) {
      return <p>Loading...</p>;
    }

    // แสดง Component หากสิทธิ์ถูกต้อง
    return <Component {...props} />;
  };
};

export default withAuth;
