"use client";

import { FaTimes } from "react-icons/fa";
import { useState } from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import { getColorFromTheme } from "../../../utils/colorMapping";
import { useTranslation } from "react-i18next";

export default function SettingsDrawer({ isOpen, onClose }) {

  const { t, i18n } = useTranslation();
  const { theme, toggleThemeMode, setNavMode, setPrimaryColor, setPrimaryWeight } = useTheme();
  const [language, setLanguage] = useState("EN");
  const [isActive, setIsActive] = useState(false);
  const [isActive1, setIsActive1] = useState(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const [isWeightDropdownOpen, setIsWeightDropdownOpen] = useState(false);


  const toggleLanguage = (code) => {
    i18n.changeLanguage(code); // เปลี่ยนภาษาใน i18n
    setLanguage(code); // อัปเดตสถานะภาษา
  };


  const themes = [
    { name: "Red", color: "bg-red" },
    { name: "Pink", color: "bg-pink" },
    { name: "Purple", color: "bg-purple" },
    { name: "Indigo", color: "bg-indigo" },
    { name: "Blue", color: "bg-blue" },
    { name: "Cyan", color: "bg-cyan" },
    { name: "Teal", color: "bg-teal" },
    { name: "Green", color: "bg-green" },
    { name: "Lime", color: "bg-lime" },
    { name: "Yellow", color: "bg-yellow" },
    { name: "Amber", color: "bg-amber" },
    { name: "Orange", color: "bg-orange" },
    { name: "Gray", color: "bg-gray" },
  ];

  const weights = ["100", "200", "300", "400", "500", "600", "700", "800", "900"];

  const handleThemeSelect = (selectedTheme) => {
    console.log("Selected Theme:", selectedTheme);
    setPrimaryColor(selectedTheme.color);
    setIsThemeDropdownOpen(false);
  };

  const handleNavModeChange = (mode) => {
    console.log("Nav Mode Changed:", mode);
    setNavMode(mode);
  };
  const handleClickW = () => {
    // อัปเดต borderColor
    const newBorderColor =
      theme.primaryColor && theme.primaryWeight
        ? getColorFromTheme(theme.primaryColor, theme.primaryWeight)
        : "border-gray-300";
    setBorderColor(newBorderColor);
    setIsActive1(true); // ตั้งสถานะว่าปุ่มถูกคลิก
    // สลับสถานะ dropdown
    setIsWeightDropdownOpen((prev) => !prev);
  };
  const handleWeightSelect = (weight) => {
    console.log("Selected Weight:", weight);
    setPrimaryWeight(weight);

    // Option 1: Use theme's color for border
    const newBorderColor = theme.primaryColor && theme.primaryWeight
      ? getColorFromTheme(theme.primaryColor, theme.primaryWeight)
      : "border-gray-300";
    setBorderColor(newBorderColor);

    // Update the primary color with the new weight
    if (theme.primaryColor) {
      const baseColor = theme.primaryColor.split("-")[1];
      const updatedColor = `bg-${baseColor}-${weight}`;
      console.log("Current Theme Color:", theme.primaryColor);
      console.log("Updated Color Class:", updatedColor);
      setPrimaryColor(updatedColor);
      console.log("New Theme Color:", theme.primaryColor);
    } else {
      console.error("Primary color not set");
    }

    setIsWeightDropdownOpen(false);
  };

  const [borderColor, setBorderColor] = useState(
    theme.primaryColor && theme.primaryWeight
      ? "border-gray-300" // ค่าเริ่มต้น
      : "border-gray-300"
  );

  const handleBlur = () => {
    // รีเซ็ต borderColor เมื่อไม่ได้อยู่ในโฟกัส
    setIsActive(false);
    setBorderColor("gray"); // กลับไปใช้สีเริ่มต้น
  };

  const handleClick = () => {
    // อัปเดต borderColor
    const newBorderColor =
      theme.primaryColor && theme.primaryWeight
        ? getColorFromTheme(theme.primaryColor, theme.primaryWeight)
        : "border-gray-300";
    setBorderColor(newBorderColor);
    setIsActive(true); // ตั้งสถานะว่าปุ่มถูกคลิก

    // สลับสถานะ dropdown
    setIsThemeDropdownOpen((prev) => !prev);
  };




  return (
    <div
      className={`fixed top-16 right-0 h-[calc(100%-4rem)] w-80 shadow-lg z-50 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
        } bg-gray-50 dark:bg-gray-900`}
    >
      <div className="flex justify-between items-center px-4 py-4 border-b dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          {t("themeConfig")} {/* ดึงข้อความจากไฟล์ JSON */}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-800 focus:outline-none dark:hover:text-gray-300"
        >
          <FaTimes size={18} />
        </button>
      </div>
      <div className="p-4 space-y-6">
        {/* Dark Mode */}
        <div>
          <label className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">{t("darkMode")}</span>
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={theme.mode === "dark"}
                onChange={toggleThemeMode}
              />
              <div
                className={`w-10 h-5 rounded-full shadow-inner transition duration-300 ${theme.mode === "dark" ? `bg-${theme.primaryColor.split('-')[1]}-${theme.primaryWeight}` : "bg-gray-200"
                  }`}
              ></div>
              <div
                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transform transition duration-300 ${theme.mode === "dark" ? "translate-x-5" : ""
                  }`}
              ></div>
            </div>
          </label>
        </div>

        {/* Language */}
        <div>
          <span className="text-gray-700 dark:text-gray-300">{t("language")}</span>
          <ul className="mt-2 space-y-2">
            {[
              { code: "en", label: "English", flag: "https://flagpedia.net/data/flags/w580/us.webp" },
              { code: "th", label: "Thai", flag: "https://flagpedia.net/data/flags/w580/th.webp" },
            ].map((lang) => (
              <li
                key={lang.code}
                onClick={() => toggleLanguage(lang.code)}
                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all duration-200 ${i18n.language === lang.code
                  ? `bg-${theme.primaryColor.split('-')[1]}-${theme.primaryWeight} text-white`
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <img src={lang.flag} alt={lang.label} className="w-6 h-6 rounded-full" />
                  <span className=" dark:text-gray-300">{lang.label}</span>
                </div>
                {i18n.language === lang.code && (
                  <span className="text-green-500 dark:text-green-300">✔</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Nav Mode */}
        <div>
          <span className="text-gray-700 dark:text-gray-300 font-semibold">
          {t("themeWidget")}
          </span>
          <div className="mt-4 flex space-x-4">
            {[
              { value: "default", label: t("default") },
              { value: "themed", label: t("themed") },
            ].map((mode) => (
              <label
                key={mode.value}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="navMode"
                  value={mode.value}
                  className="hidden peer"
                  onChange={() => {
                    handleNavModeChange(mode.value);

                    // กำหนดค่าเริ่มต้นเมื่อเลือก Default
                    if (mode.value === "default") {
                      setPrimaryColor("bg-blue-500"); // ธีมย่อยเป็นค่าเริ่มต้น
                      setPrimaryWeight("500");
                    }
                  }}
                  checked={theme.navMode === mode.value}
                />
                <span
                  className={`w-4 h-4 rounded-full border-2 transition-all ${theme.navMode === mode.value
                    ? `border-${theme.primaryColor.split('-')[1]}-${theme.primaryWeight} bg-${theme.primaryColor.split('-')[1]}-${theme.primaryWeight}`
                    : "border-gray-300 dark:border-gray-600 bg-transparent"
                    }`}
                ></span>
                <span className="text-gray-700 dark:text-gray-300">{mode.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Theme และ Weight */}
        {theme.navMode !== "default" && (
          <div className="flex flex-row space-x-4 items-start">
            {/* Theme */}
            <div className="flex-1">
              <span className="text-gray-700 dark:text-gray-300">{t("theme")}</span>
              <div className="relative w-full">
                <button
                  onClick={handleClick}
                  onBlur={handleBlur}
                  className={`w-full flex items-center justify-between px-4 py-2 border rounded-md focus:outline-none transition ${theme.primaryColor && theme.primaryWeight ? "" : "border-gray-300"
                    }`}
                  style={{
                    borderColor,
                  }}
                  disabled={theme.navMode === "default"}
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: theme.primaryColor && theme.primaryWeight
                          ? getColorFromTheme(theme.primaryColor, theme.primaryWeight)
                          : "transparent",
                      }}
                    ></div>
                    <span
                      className="text-gray-700 dark:text-gray-300"
                    >
                      {theme.primaryColor
                        ? theme.primaryColor.replace("bg-", "").split('-')[0]
                        : "Select Theme"}
                    </span>



                  </div>
                  <span className="text-gray-500">▼</span>
                </button>

                {isThemeDropdownOpen && (
                  <ul className="absolute z-10 mt-2 w-full bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {themes.map((t) => (
                      <li
                        key={t.color}
                        onClick={() => handleThemeSelect(t)}
                        className={`flex items-center space-x-2 px-4 py-2 cursor-pointer transition-colors ${t.color === theme.primaryColor
                          ? `bg-${t.color.split('-')[1]}-${theme.primaryWeight} text-white`
                          : "hover:bg-gray-200 dark:hover:bg-gray-700"
                          }`}
                      >
                        {/* จุดสี */}
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{
                            backgroundColor: getColorFromTheme(t.color, theme.primaryWeight),
                          }}
                        ></div>
                        {/* ชื่อธีม */}
                        <span className="text-gray-700 dark:text-gray-300">{t.name}</span>
                      </li>
                    ))}
                  </ul>

                )}
              </div>
            </div>

            {/* Weight */}
            <div className="flex-1">
              <span className="text-gray-700 dark:text-gray-300">{t("weight")}</span>
              <div className="relative w-full">
                <button
                  onClick={handleClickW}
                  className={`w-full flex items-center justify-between px-4 py-2 border rounded-md focus:outline-none transition ${theme.primaryColor && theme.primaryWeight ? "" : "border-gray-300"
                    }`}
                  style={{
                    borderColor,
                  }}
                  disabled={theme.navMode === "default"}
                >
                  <span
                    className="text-gray-700 dark:text-gray-300"
                  >
                    {theme.primaryWeight || "Select Weight"}
                  </span>
                  <span className="text-gray-500">▼</span>
                </button>

                {isWeightDropdownOpen && (
                  <ul className="absolute z-10 mt-2 w-full bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {weights.map((w) => (
                      <li
                        key={w}
                        onClick={() => handleWeightSelect(w)}
                        className={`px-4 py-2 cursor-pointer transition-colors ${w === theme.primaryWeight
                          ? `bg-${theme.primaryColor.split('-')[1]}-${theme.primaryWeight} text-white`
                          : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                          }`}
                      >
                        {w}
                      </li>
                    ))}
                  </ul>

                )}
              </div>
            </div>
          </div>
        )}


      </div>
    </div >




  );
}
