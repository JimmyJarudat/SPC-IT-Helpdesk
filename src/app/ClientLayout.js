"use client";

import { useEffect } from 'react';

import dynamic from "next/dynamic";
import "./globals.css";
//import '../lib/api';
import { Toaster } from 'sonner';
import ConsoleWarningModal from './components/ConsoleWarningModal';

import { UserProvider } from '../contexts/UserContext';
import { ThemeProvider } from "../contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageProvider";
import { SidebarProvider } from "../contexts/SidebarContext";
import { useUser } from "@/contexts/UserContext";
import DashboardLayout from "./components/DashboardLayout/DashboardLayout";
import { usePathname } from "next/navigation";
import { LoadingProvider } from "@/contexts/LoadingContext";
import PendingApproval from "./pendingApproval/page";
import useLastActivity from "@/hooks/useLastActivity"; // นำเข้า hook
import { useRouter } from "next/navigation";


const LoginPage = dynamic(() => import("./login/page"), { ssr: false });

function AppStack({ children }) {
    return (
        <SidebarProvider>
            <DashboardLayout>
                {children}
            </DashboardLayout>
        </SidebarProvider>
    );
}

function AuthStack({ roleStatus }) {
    if (roleStatus === "pending") {
        return <PendingApproval />;
    }
    return <LoginPage />;
}


function RootLayoutContent({ children }) {
    const { user } = useUser();
    const pathname = usePathname();
    const router = useRouter();


    // เรียกใช้ useLastActivity เพื่อดึงข้อมูลสถานะการออนไลน์
    useLastActivity(); // เรียกใช้ hook

    useEffect(() => {
        if (user?.isFirstLogin && pathname !== "/ChangePassword") {
            router.replace("/ChangePassword");
        }
    }, [user, pathname, router]);

    // หากเป็นหน้า Home ("/") ให้แสดงเฉพาะ children โดยไม่มี Navbar และ Sidebar
    if (pathname === "/") {
        return children; // Render เฉพาะเนื้อหา children ของหน้า Home
    }


    if (pathname === "/pendingApproval") {
        return children; // Render เฉพาะเนื้อหา children ของหน้า Home
    }

    if (pathname === "/unauthorized") {
        return  children ;
    }
    if (pathname === "/ChangePassword") {
        return children; // Render เฉพาะเนื้อหา children
    }
    
    // หากยังไม่ได้ล็อกอิน
    if (!user) {
        return <AuthStack />;
    }

   



    // หากล็อกอินแล้ว แสดงหน้า AppStack ซึ่งมี Sidebar และ Dashboard
    return <AppStack>{children}</AppStack>;
}


export default function ClientLayout({ children }) {
    return (
        <ThemeProvider>
            <LanguageProvider>
                <LoadingProvider>
                    <UserProvider>
                        <RootLayoutContent>{children}</RootLayoutContent>
                        <Toaster />
                        <ConsoleWarningModal />
                    </UserProvider>
                </LoadingProvider>
            </LanguageProvider>
        </ThemeProvider>
    );
}

