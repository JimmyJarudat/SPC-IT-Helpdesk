"use client";
import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {

  const defaultTheme = {
    mode: "light",
    navMode: "default",
    primaryColor: "bg-blue",
    primaryWeight: "500",
  };

  const [theme, setTheme] = useState(defaultTheme);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // โหลดค่าจาก Local Storage หลังจาก Component ถูก Mount
      const savedTheme = localStorage.getItem("appTheme");
      if (savedTheme) {
        setTheme(JSON.parse(savedTheme));
      }
    }
  }, []);

  // เมื่อ theme เปลี่ยน ให้บันทึกลง Local Storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem('appTheme', JSON.stringify(theme));
      document.body.classList.toggle("dark", theme.mode === "dark");
    }
  }, [theme]);

  const toggleThemeMode = () => {
    setTheme((prevTheme) => ({
      ...prevTheme,
      mode: prevTheme.mode === "dark" ? "light" : "dark"
    }));
  };

  const setNavMode = (mode) => {
    setTheme((prev) => ({ ...prev, navMode: mode }));
  };

  const setPrimaryColor = (color) => {
    setTheme((prev) => ({ ...prev, primaryColor: color }));
  };

  const setPrimaryWeight = (weight) => {
    setTheme((prev) => ({
      ...prev,
      primaryWeight: weight,
      primaryColor: `${prev.primaryColor.split("-")[0]}-${prev.primaryColor.split("-")[1]}-${weight}`,
    }));
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleThemeMode,
        setNavMode,
        setPrimaryColor,
        setPrimaryWeight,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);