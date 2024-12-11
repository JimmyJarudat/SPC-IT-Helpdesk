"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Named import ที่ถูกต้อง

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // เก็บข้อมูลผู้ใช้
  const [isLoading, setIsLoading] = useState(true); // สถานะการโหลดข้อมูล
  const [updateStatus, setUpdateStatus] = useState(false);

  
  
  useEffect(() => {
    const loadUserFromCookie = () => {
      const cookieString = document.cookie;
      const token = cookieString
        .split("; ")
        .find((row) => row.startsWith("authToken="))
        ?.split("=")[1];

      //console.log("Token from Cookies:", token); // Debug Token

      if (token) {
        try {
          const decoded = jwtDecode(token);
         // console.log("Decoded User:", decoded);
          setUser(decoded);
        } catch (error) {
         // console.error("Error decoding token:", error.message);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    loadUserFromCookie();
    setIsLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      document.cookie = `authToken=${data.token}; Path=/; Max-Age=${60 * 60 * 24 * 7}`; // บันทึก Token ลงใน Cookies
      console.log("User after login:", data.user); // Debug User
      setUser(data.user);
    } catch (error) {
      console.error("Login failed:", error.message);
      throw error;
    }
  };

  const logout = () => {
    document.cookie = "authToken=; Path=/; Max-Age=0"; // ลบ Cookies
    setUser(null); // รีเซ็ต Context
  };

  // ฟังก์ชันสำหรับดึงรูปภาพผู้ใช้
  const fetchProfile = async () => {
    try {
        const response = await fetch("/api/profile/profileupdate", {
            method: "GET",
        });

        if (response.ok) {
            const data = await response.json();
            setUser(data);  // อัปเดตข้อมูลผู้ใช้ใน UserContext

            // ดึงรูปภาพ
            if (data.profileImage) {
                try {
                    const imageResponse = await fetch(data.profileImage, {
                        method: "GET",
                        headers: {
                            username: data.username,
                        },
                    });

                    if (imageResponse.ok) {
                        const blob = await imageResponse.blob();
                        const imageUrl = URL.createObjectURL(blob);
                        setUser((prev) => ({
                            ...prev,
                            profileImage: imageUrl,
                        }));
                    } else {
                        console.warn("Image not found, using placeholder.");
                        setUser((prev) => ({
                            ...prev,
                            profileImage: "/files/profile-images/placeholder.png",
                        }));
                    }
                } catch (error) {
                    console.error("Error fetching profile image:", error);
                }
            }
        } else {
            console.error("Failed to fetch profile");
        }
    } catch (error) {
        console.error("Error fetching profile:", error);
    }
};


  return (
    <UserContext.Provider value={{ user, isLoading, login, logout, fetchProfile,updateStatus, setUpdateStatus, }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
