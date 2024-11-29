"use client";

import { createContext, useContext, useState } from "react";

// สร้าง Context
const UserContext = createContext();

// Provider สำหรับห่อแอปพลิเคชัน
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // state สำหรับเก็บข้อมูลผู้ใช้

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom Hook สำหรับดึง Context
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser ต้องอยู่ภายใน UserProvider");
    }
    return context;
};
