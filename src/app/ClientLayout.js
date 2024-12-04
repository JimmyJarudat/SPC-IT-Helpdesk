"use client";

import dynamic from "next/dynamic";
import "./globals.css";

import { UserProvider } from '../contexts/UserContext';
import { ThemeProvider } from "../contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageProvider";
import { SidebarProvider } from "../contexts/SidebarContext";
import { useUser } from "@/contexts/UserContext";
import DashboardLayout from "./components/DashboardLayout/DashboardLayout";
import LoginPage from "./login/page";
import { usePathname } from "next/navigation";


function AppStack({ children }) {
    return (
        <SidebarProvider>
            <DashboardLayout>
                {children}
            </DashboardLayout>
        </SidebarProvider>
    );
}

function AuthStack() {
    return (
        <LoginPage />
    );
}

function RootLayoutContent({ children }) {
    const { user } = useUser();
    const pathname = usePathname();

    // หากเป็นหน้า Home ("/") ให้แสดงเฉพาะ children โดยไม่มี Navbar และ Sidebar
    if (pathname === "/") {
        return children; // Render เฉพาะเนื้อหา children ของหน้า Home
    }

    if (pathname === "/pendingApproval") {
        return children; // Render เฉพาะเนื้อหา children ของหน้า Home
    }

    // หากยังไม่ได้ล็อกอิน แสดงหน้า AuthStack (เช่นหน้า Login)
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
                <UserProvider>
                    <RootLayoutContent>{children}</RootLayoutContent>
                </UserProvider>
            </LanguageProvider>
        </ThemeProvider>
    );
}

