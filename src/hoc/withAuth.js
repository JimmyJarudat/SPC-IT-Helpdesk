import { useRouter } from 'next/navigation';
import { useUser } from '../contexts/UserContext';
import { useEffect } from 'react';

const withAuth = (Component, allowedRoles) => {
    return (props) => {
        const { user, isLoading } = useUser();
        const router = useRouter();

        useEffect(() => {
            if (isLoading) return;

            if (!user) {
                console.log("Redirecting to /login...");
                router.replace('/login');
            } else if (!allowedRoles.includes(user.role)) {
                console.log("Redirecting to /unauthorized...");
                router.replace('/unauthorized');
            } else if (user.role_status !== 'approved') {
                console.log("Redirecting to /pendingApproval...");
                router.replace('/pendingApproval');
            }
        }, [user, isLoading, router, allowedRoles]);

        if (isLoading) {
            return <p>Loading...</p>;
        }

        if (!user || !allowedRoles.includes(user.role) || user.role_status !== 'approved') {
            return null; // Prevent rendering when redirecting
        }

        return <Component {...props} />;
    };
};

export default withAuth;
