"use client"

import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // ตรวจสอบสถานะการล็อกอินหลังรีเฟรช
    const fetchUser = async () => {
      const token = Cookies.get('authToken'); // ตรวจสอบว่า authToken มีอยู่
      if (token) {
        try {
          const response = await axios.get('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data.user); // ตั้งค่าสถานะผู้ใช้
        } catch (error) {
          console.error('Error fetching user:', error);
          setUser(null); // หากเกิดข้อผิดพลาดให้รีเซ็ตสถานะผู้ใช้
        }
      } else {
        setUser(null); // หากไม่มี authToken ให้รีเซ็ตสถานะผู้ใช้
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    // ตรวจสอบ Cookie ว่ามีข้อมูลผู้ใช้หรือไม่
    const fetchUser = async () => {
      try {
        const response = await axios.get('/api/auth/me'); // เรียก API เพื่อตรวจสอบสถานะผู้ใช้
        setUser(response.data.user);
      } catch (error) {
        setUser(null); // ถ้าไม่มีข้อมูลให้ตั้งค่าเป็น null
      }
    };
    fetchUser();
  }, []);

  

  const login = async (username, password) => {
    console.log('Attempting login with:', { username, password }); // Debug ข้อมูลที่ส่งไป
  
    try {
      const response = await axios.post('/api/auth/login', { username, password });
      const userData = response.data.user;
      setUser(userData); // บันทึกข้อมูลผู้ใช้ใน Context
      console.log('Login successful:', userData); // Debug ข้อมูลที่ได้รับกลับมา
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message); // Debug ข้อผิดพลาด
      throw error;
    }
  };
  
  

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout'); // เรียก API สำหรับลบ Cookie
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
