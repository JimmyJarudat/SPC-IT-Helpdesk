import { useRouter } from 'next/navigation';
import { useUser } from '../contexts/UserContext';
import { useEffect } from 'react';

const withAuth = (Component, allowedRoles) => {
  return (props) => {
    const { user, isLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
      if (isLoading) return; // รอโหลดข้อมูลเสร็จ

      if (!user) {
        console.log("Redirecting to /login..."); // Debug
        router.replace('/login');
      } else if (!allowedRoles.includes(user.role)) {
        console.log("Redirecting to /unauthorized..."); // Debug
        router.replace('/unauthorized');
      }
    }, [user, isLoading, router, allowedRoles]);

    if (isLoading || !user || !allowedRoles.includes(user.role)) {
      return <p>Loading...</p>;
    }

    return <Component {...props} />;
  };
};

export default withAuth;
