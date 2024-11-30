"use client";

import { createContext, useContext, useState } from "react";

// สร้าง Context
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // State สำหรับ Theme
  const [theme, setTheme] = useState({
    mode: "light", // โหมดหลัก: light หรือ dark
    navMode: "default", // default หรือ themed
    primaryColor: "bg-blue-500", // สีหลัก (ธีมย่อย)
    hoverColor: "hover:bg-blue-600", // สี hover (ธีมย่อย)
  });

  // ฟังก์ชันสำหรับเปลี่ยนโหมด Light/Dark
  const toggleThemeMode = () => {
    setTheme((prevTheme) => ({
      ...prevTheme,
      mode: prevTheme.mode === "light" ? "dark" : "light",
    }));

    // เปลี่ยนคลาสใน body เพื่อรองรับโหมด light/dark
    if (theme.mode === "light") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  };

  // ฟังก์ชันสำหรับเปลี่ยน Nav Mode
  const setNavMode = (mode) => {
    setTheme((prevTheme) => ({
      ...prevTheme,
      navMode: mode, // เปลี่ยนเป็น default หรือ themed
    }));
  };

  // ฟังก์ชันสำหรับเปลี่ยนสีธีมหลัก (เฉพาะเมื่อ navMode = "themed")
  const setPrimaryColor = (color) => {
    setTheme((prevTheme) => ({
      ...prevTheme,
      primaryColor: color,
      hoverColor: `hover:${color.split("-")[0]}-${parseInt(color.split("-")[1]) + 100}`,
    }));
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleThemeMode,
        setNavMode,
        setPrimaryColor,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Hook สำหรับใช้ Theme Context
export const useTheme = () => useContext(ThemeContext);
