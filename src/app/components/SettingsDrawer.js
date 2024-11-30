"use client";

import { FaTimes } from "react-icons/fa";
import { useState } from "react";


export default function SettingsDrawer({ isOpen, onClose, }) {
  const [isDarkMode, setIsDarkMode] = useState(false); // จัดการสถานะ Dark Mode
  const [language, setLanguage] = useState("EN");

  const [currentTheme, setCurrentTheme] = useState({
    name: "Green",
    color: "bg-green-500",
  });
  const [currentWeight, setCurrentWeight] = useState("600");

  const themes = [
    { name: "Red", color: "bg-red-500" },
    { name: "Orange", color: "bg-orange-500" },
    { name: "Amber", color: "bg-amber-500" },
    { name: "Yellow", color: "bg-yellow-500" },
    { name: "Lime", color: "bg-lime-500" },
    { name: "Green", color: "bg-green-500" },
    { name: "Emerald", color: "bg-emerald-500" },
    { name: "Teal", color: "bg-teal-500" },
    { name: "Blue", color: "bg-blue-500" },
    { name: "Pink", color: "bg-pink-500" },
  ];

  const weights = ["400", "500", "600", "700", "800", "900"];

  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const [isWeightDropdownOpen, setIsWeightDropdownOpen] = useState(false);

  const toggleThemeDropdown = () =>
    setIsThemeDropdownOpen(!isThemeDropdownOpen);
  const toggleWeightDropdown = () =>
    setIsWeightDropdownOpen(!isWeightDropdownOpen);

  const handleThemeSelect = (theme) => {
    setCurrentTheme(theme);
    setIsThemeDropdownOpen(false);
  };

  const handleWeightSelect = (weight) => {
    setCurrentWeight(weight);
    setIsWeightDropdownOpen(false);
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
    console.log(`Dark Mode is now ${!isDarkMode ? "ON" : "OFF"}`);
    // เพิ่มฟังก์ชันเพื่อเปลี่ยนธีมในโปรเจกต์ เช่น การเพิ่ม/ลบคลาสใน body
    if (!isDarkMode) {
      document.body.classList.add("dark"); // เพิ่มคลาสสำหรับ Dark Mode
    } else {
      document.body.classList.remove("dark"); // ลบคลาสสำหรับ Light Mode
    }
  };
  return (
    <div
      className={`fixed top-16 right-0 h-[calc(100%-4rem)] w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
        }`}
    >
      <div className="flex justify-between items-center px-4 py-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">Theme Config</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-800 focus:outline-none"
        >
          <FaTimes size={18} />
        </button>
      </div>
      <div className="p-4 space-y-6">
        {/* Dark Mode */}
        <div>
          <label className="flex items-center justify-between">
            <span className="text-gray-700">Dark Mode</span>
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={isDarkMode}
                onChange={toggleDarkMode}
              />
              <div
                className={`w-10 h-5 rounded-full shadow-inner transition duration-300 ${isDarkMode ? "bg-blue-500" : "bg-gray-200"
                  }`}
              ></div>
              <div
                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transform transition duration-300 ${isDarkMode ? "translate-x-5" : ""
                  }`}
              ></div>
            </div>
          </label>
          <p className="text-gray-500 text-sm">
            Switch theme to {isDarkMode ? "light" : "dark"} mode
          </p>
        </div>

        {/* Language */}
        <div>
          <span className="text-gray-700">Language</span>
          <div className="mt-4">
            <ul className="space-y-2">
              {[
                { code: "EN", label: "English", flag: "https://flagpedia.net/data/flags/w580/us.webp" },
                { code: "TH", label: "Thai", flag: "https://flagpedia.net/data/flags/w580/th.webp" },
              ].map((lang) => (
                <li
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all duration-200 ${language === lang.code
                    ? "bg-blue-100 text-blue-600"
                    : "hover:bg-gray-100"
                    }`}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={lang.flag}
                      alt={lang.label}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="font-medium text-gray-700">{lang.label}</span>
                  </div>
                  {language === lang.code && (
                    <span className="text-green-500 text-lg font-bold">✔</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>


        {/* Nav Mode */}
        <div>
          <span className="text-gray-700 font-semibold">Nav Mode</span>
          <div className="mt-4 flex space-x-4">
            {[
              { value: "default", label: "Default" },
              { value: "themed", label: "Themed" },
            ].map((mode) => (
              <label
                key={mode.value}
                className="flex items-center space-x-2 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="navMode"
                  value={mode.value}
                  className="hidden peer"
                  onChange={() => console.log(`Selected: ${mode.value}`)}
                />
                <span className="w-4 h-4 rounded-full border border-gray-300 peer-checked:border-blue-500 peer-checked:bg-blue-500 transition-all"></span>
                <span className="text-gray-700 font-medium group-hover:text-blue-500 transition-all">
                  {mode.label}
                </span>
              </label>
            ))}
          </div>
        </div>


        {/* Theme */}
        <div className="flex flex-col space-y-4 w-full max-w-md mx-auto">
          {/* Theme Selector */}
          <div className="flex flex-col space-y-2">
            <span className="text-gray-700 font-semibold">Theme</span>
            <div className="flex space-x-4">
              {/* ปุ่มเลือกธีม */}
              <div className="relative w-full">
                <button
                  onClick={toggleThemeDropdown}
                  className="w-full flex items-center justify-between px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring focus:ring-gray-300"
                >
                  <div className="flex items-center space-x-2">
                    <span
                      className={`w-3 h-3 rounded-full ${currentTheme.color}`}
                    ></span>
                    <span>{currentTheme.name}</span>
                  </div>
                  <span className="text-gray-500">▼</span>
                </button>

                {/* Dropdown ธีม */}
                {isThemeDropdownOpen && (
                  <ul className="absolute z-10 mt-2 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {themes.map((theme) => (
                      <li
                        key={theme.name}
                        onClick={() => handleThemeSelect(theme)}
                        className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-100"
                      >
                        <div className="flex items-center space-x-2">
                          <span
                            className={`w-3 h-3 rounded-full ${theme.color}`}
                          ></span>
                          <span>{theme.name}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* ปุ่มเลือกน้ำหนัก */}
              <div className="relative w-full">
                <button
                  onClick={toggleWeightDropdown}
                  className="w-full flex items-center justify-between px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring focus:ring-gray-300"
                >
                  <span>{currentWeight}</span>
                  <span className="text-gray-500">▼</span>
                </button>

                {/* Dropdown น้ำหนัก */}
                {isWeightDropdownOpen && (
                  <ul className="absolute z-10 mt-2 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {weights.map((weight) => (
                      <li
                        key={weight}
                        onClick={() => handleWeightSelect(weight)}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                      >
                        {weight}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>



      </div>
    </div>
  );
}
