"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Named import ที่ถูกต้อง

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // เก็บข้อมูลผู้ใช้
  const [isLoading, setIsLoading] = useState(true); // สถานะการโหลดข้อมูล
  const [updateStatus, setUpdateStatus] = useState(false);
  const [error, setError] = useState(null);


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
          if (decoded.id) {
            localStorage.setItem('userId', decoded.id);
          }
        } catch (error) {
          // console.error("Error decoding token:", error.message);
          setUser(null);
          localStorage.removeItem('userId');
          
        }
      } else {
        setUser(null);
        localStorage.removeItem('userId');
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
        const errorData = await response.json();
        throw new Error(errorData.message || "An unexpected error occurred.");
      }
  
      const data = await response.json();
      document.cookie = `authToken=${data.token}; Path=/; Max-Age=${60 * 60 * 24 * 7}`;  // บันทึก Token
      if (data.user.id) {
        localStorage.setItem('userId', data.user.id);
      }
      console.log("User after login:", data.user);
      setUser(data.user);  // อัพเดตข้อมูลผู้ใช้
  
    } catch (error) {
      throw error;  // ส่งข้อผิดพลาดกลับไปที่ handleLogin
    }
  };
  
  
  





  const logout = async () => {
    // ลบ Cookies
    document.cookie = "authToken=; Path=/; Max-Age=0";

    // รีเซ็ต Context
    setUser(null);

    // ส่งคำขอ API เพื่ออัปเดตสถานะผู้ใช้เป็น offline
    if (user?.id) {
      try {
        const response = await fetch(`/api/userManagement/log/update-last-activity?userId=${user.id}&status=offline`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          console.log('User status updated to offline:', data);
        } else {
          console.error('Failed to update user status on logout');
        }
      } catch (error) {
        console.error('Error updating user status on logout:', error);
      }
    }
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
    <UserContext.Provider value={{ user, isLoading, login, logout, fetchProfile, updateStatus, setUpdateStatus, }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
