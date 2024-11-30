"use client";
import { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState({
    mode: "light", // light/dark
    navMode: "default", // default/themed
    primaryColor: "bg-blue",
    primaryWeight: "500", // Default weight
  });

  const toggleThemeMode = () => {
    setTheme((prevTheme) => {
      const newMode = prevTheme.mode === "dark" ? "light" : "dark";
      document.body.classList.toggle("dark", newMode === "dark");
      return { ...prevTheme, mode: newMode };
    });
  };

  const setNavMode = (mode) => {
    console.log(`Nav mode updated: ${mode}`);
    setTheme((prev) => ({ ...prev, navMode: mode }));
  };

  const setPrimaryColor = (color) => {
    console.log("Primary color updated:", color);
    setTheme((prev) => ({ ...prev, primaryColor: color }));
  };

  const setPrimaryWeight = (weight) => {
    console.log("Primary weight updated:", weight);
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
