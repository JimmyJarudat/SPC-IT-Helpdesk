'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { FaLock, FaSignOutAlt, FaExclamationCircle } from "react-icons/fa";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordStrength, setPasswordStrength] = useState({
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    isMinLength: false,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const { logout } = useUser();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "newPassword") {
      const strength = {
        hasUpperCase: /[A-Z]/.test(value),
        hasLowerCase: /[a-z]/.test(value),
        hasNumber: /[0-9]/.test(value),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
        isMinLength: value.length >= 8,
      };
      setPasswordStrength(strength);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    if (!Object.values(passwordStrength).every(Boolean)) {
      setErrorMessage("New password does not meet security requirements.");
      return;
    }

    const res = await fetch("/api/profile/profileupdate", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      }),
    });

    if (res.ok) {
      alert("Password changed successfully!");
      await logout();
      router.push("/login");
    } else {
      setErrorMessage("Current password is incorrect or update failed.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-200 via-blue-100 to-blue-300 dark:from-gray-800 dark:to-gray-900">

      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
            <FaLock className="text-blue-500" /> Change Password
          </h1>
          <button
            onClick={async () => {
              try {
                await logout(); // เรียก Logout
                router.push("/"); // เปลี่ยนเส้นทางไปหน้าหลัก
              } catch (error) {
                console.error("Logout failed:", error);
              }
            }}
            className="flex items-center gap-2 text-red-500 hover:text-red-600"
          >
            <FaSignOutAlt /> Logout
          </button>

        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 flex items-center gap-2">
          <FaExclamationCircle className="text-yellow-500 w-8 h-8" />
          For security reasons, you are required to change your password.  ||  รหัสผ่านของคุณจะเป็นของคนเพียงคนเดียว
        </p>

        {errorMessage && (
          <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-200 mb-2">
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-200 mb-2">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
              required
            />
            <ul className="text-sm mt-2">
              <li
                className={
                  passwordStrength.hasUpperCase
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                - At least one uppercase letter
              </li>
              <li
                className={
                  passwordStrength.hasLowerCase
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                - At least one lowercase letter
              </li>
              <li
                className={
                  passwordStrength.hasNumber
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                - At least one number
              </li>
              <li
                className={
                  passwordStrength.hasSpecialChar
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                - At least one special character (!@#$%^&*)
              </li>
              <li
                className={
                  passwordStrength.isMinLength
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                - Minimum 8 characters
              </li>
            </ul>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-200 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
