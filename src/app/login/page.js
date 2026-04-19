'use client';

import { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  // ==================== STATE ====================
  // ข้อมูลสำหรับ Login
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // ข้อมูลสำหรับ Sign Up
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [nickName, setNickName] = useState('');
  const [employeeID, setEmployeeID] = useState('');
  const [company, setCompany] = useState('');
  const [department, setDepartment] = useState('');
  const [phone, setPhone] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [computerName, setComputerName] = useState('');
  const [division, setDivision] = useState('');
  const [position, setPosition] = useState('');
  const [location, setLocation] = useState('');

  // สถานะทั่วไป
  const [error, setError] = useState(null);
  const [isLogin, setIsLogin] = useState(true); // Toggle ระหว่าง Login และ Sign Up

  // สถานะสำหรับระบบล็อกอินผิดหลายครั้ง
  const [failedLoginAttempts, setFailedLoginAttempts] = useState(0);
  const [lockTime, setLockTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  const { login } = useUser();
  const router = useRouter();

  // ==================== AUTO-FILL DEMO ====================
  // ใส่ username และ password Demo อัตโนมัติตอนโหลดหน้า
  useEffect(() => {
    setUsername('demo');
    setPassword('Demo@1234');
  }, []);

  // ==================== LOCK TIMER ====================
  // เมื่อล็อกอินผิดครบ 3 ครั้ง ให้ตั้งเวลาล็อก 5 นาที
  useEffect(() => {
    if (failedLoginAttempts >= 3) {
      const unlockTime = new Date().getTime() + 5 * 60 * 1000;
      setLockTime(unlockTime);
    }
  }, [failedLoginAttempts]);

  // นับถอยหลังเวลาล็อก และรีเซ็ตเมื่อหมดเวลา
  useEffect(() => {
    let interval;
    if (lockTime) {
      interval = setInterval(() => {
        const remainingTime = lockTime - new Date().getTime();
        setTimeLeft(remainingTime);

        if (remainingTime <= 0) {
          clearInterval(interval);
          setFailedLoginAttempts(0);
          setLockTime(null); // รีเซ็ต lockTime ด้วย เพื่อให้ Modal ปิดอัตโนมัติ
          setTimeLeft(0);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [lockTime]);

  // ==================== HANDLERS ====================
  // จัดการ Login
  const handleLogin = async (e) => {
    e.preventDefault();

    // ถ้ายังอยู่ในช่วงล็อก ไม่ให้ทำการล็อกอิน
    if (failedLoginAttempts >= 3 && timeLeft > 0) return;

    try {
      setError(null);
      await login(username, password);
      router.push('/overview');
    } catch (error) {
      setError(error.message);
      const newAttempts = failedLoginAttempts + 1;
      setFailedLoginAttempts(newAttempts);

      // ตั้งเวลาล็อกทันทีเมื่อครบ 3 ครั้ง
      if (newAttempts >= 3) {
        const unlockTime = new Date().getTime() + 5 * 60 * 1000;
        setLockTime(unlockTime);
      }
    }
  };

  // จัดการปิด Modal — ปิดได้เฉพาะเมื่อหมดเวลาล็อกแล้ว
  const handleCloseModal = () => {
    if (timeLeft <= 0) {
      setLockTime(null);
      setFailedLoginAttempts(0);
      setTimeLeft(0);
    }
  };

  // จัดการ Sign Up
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      setError(null);

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          username,
          password,
          confirmPassword,
          email,
          employeeID,
          company,
          department,
          nickName,
          phone,
          profileImage,
          computerName,
          division,
          position,
          location,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sign up');
      }

      alert('Sign up successful! Please log in.');
      setIsLogin(true);
    } catch (err) {
      setError(err.message);
    }
  };

  // ==================== RENDER ====================
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="bg-white shadow-2xl rounded-lg p-6 sm:p-8 lg:p-10 w-full max-w-md">

        {/* โลโก้บริษัท */}
        <div className="flex justify-center mb-6">
          <img
            src="/asset/png/bg-j.ico"
            alt="Company Logo"
            className="w-20 h-20 sm:w-20 sm:h-20"
          />
        </div>

        {/* หัวข้อและคำอธิบาย */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-center text-gray-800 mb-4">
          {isLogin ? 'Login' : 'Sign Up'}
        </h1>
        <p className="text-center text-gray-500 text-sm sm:text-base mb-6">
          {isLogin
            ? 'Welcome back! Please login to your account.'
            : 'Create your account to get started.'}
        </p>

        {/* ฟอร์ม — ใช้ onSubmit เท่านั้น ไม่ต้องใส่ onClick ซ้ำที่ปุ่ม */}
        <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-6">

          {/* แสดง Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* ==================== ฟอร์ม Login ==================== */}
          {isLogin && (
            <>
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* ปุ่ม Login — ใช้ type="submit" แทน onClick เพื่อไม่ให้ยิงซ้ำ */}
              <div>
                <button
                  type="submit"
                  disabled={failedLoginAttempts >= 3 && timeLeft > 0}
                  className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-bold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Login
                </button>
              </div>
            </>
          )}

          {/* ==================== ฟอร์ม Sign Up ==================== */}
          {!isLogin && (
            <div className="max-w-lg mx-auto space-y-6">

              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-semibold mb-1">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your username"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirm your password"
                />
              </div>

              {/* ปุ่ม Sign Up — ใช้ type="submit" */}
              <div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-bold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
                >
                  Sign Up
                </button>
              </div>
            </div>
          )}

        </form>

        {/* Toggle สลับระหว่าง Login / Sign Up */}
        <p className="text-center text-gray-500 text-sm mt-6">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-400 hover:text-blue-600 font-medium transition-colors"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>

        {/* Footer */}
        <p className="text-center text-gray-400 text-xs mt-4">
          By logging in or signing up, you agree to our{' '}
          <a href="#" className="text-blue-400 hover:text-blue-600 font-medium transition-colors">
            Privacy Policy
          </a>{' '}
          and{' '}
          <a href="#" className="text-blue-400 hover:text-blue-600 font-medium transition-colors">
            Terms of Service
          </a>
          .
        </p>

        {/* Security Notice */}
        <div className="mt-6 bg-gray-50 border-t border-gray-200 py-4 px-6 rounded-lg text-sm text-gray-600">
          <p>🔒 Your credentials are securely encrypted and will not be shared with third parties.</p>
          <p className="mt-2">
            Need help? Contact{' '}
            <a href="mailto:jarudat.jc@gmail.com" className="text-blue-400 hover:text-blue-600 font-medium transition-colors">
              jarudat.jc@gmail.com
            </a>
            .
          </p>
        </div>
      </div>

      {/* ==================== Modal แจ้งเตือนบัญชีถูกล็อก ==================== */}
      {/* แสดง Modal เฉพาะเมื่อล็อกอินผิดครบ 3 ครั้ง และยังอยู่ในช่วงเวลาล็อก */}
      {failedLoginAttempts >= 3 && timeLeft > 0 && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg w-96 max-w-lg text-center shadow-xl">

            <h2 className="text-xl font-semibold text-gray-800 mt-4">Account Locked</h2>
            <p className="mt-2 text-base text-gray-600">
              Your account is locked due to multiple failed login attempts.
            </p>

            {/* นับถอยหลังเวลาที่เหลือ */}
            <p className="mt-4 text-2xl font-bold text-red-500">
              Please wait {Math.floor(timeLeft / 1000)} seconds before trying again.
            </p>

            <p className="mt-4 text-sm text-gray-500">
              For assistance, please contact{' '}
              <a href="mailto:jarudat.jc@gmail.com" className="text-blue-500 hover:text-blue-600">
                jarudat.jc@gmail.com
              </a>
              .
            </p>

            {/* ปุ่ม Close — เปิดให้กดได้เมื่อหมดเวลา, ปิดระหว่างล็อก */}
            <button
              onClick={handleCloseModal}
              disabled={timeLeft > 0}
              className="mt-6 bg-gray-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {timeLeft > 0 ? `Wait ${Math.floor(timeLeft / 1000)}s` : 'Close'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default LoginPage;