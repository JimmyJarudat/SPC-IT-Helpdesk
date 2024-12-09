'use client';

import { useState } from 'react';
import { useUser } from '../../contexts/UserContext';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [nickName, setNickName] = useState('');
  const [employeeID, setEmployeeID] = useState('');
  const [company, setCompany] = useState('');
  const [department, setDepartment] = useState(''); // แผนก
  const [phone, setPhone] = useState(''); // เบอร์โทรศัพท์
  const [profileImage, setProfileImage] = useState(''); // รูปโปรไฟล์
  const [computerName, setComputerName] = useState(''); // ชื่อเครื่องคอมพิวเตอร์
  const [division, setDivision] = useState(''); // ฝ่าย
  const [position, setPosition] = useState(''); // ตำแหน่ง
  const [location, setLocation] = useState(''); // สถานที่
  const [error, setError] = useState(null); // สำหรับจัดการข้อผิดพลาด
  const { login } = useUser(); // ดึงฟังก์ชัน login จาก Context
  const router = useRouter(); // ใช้สำหรับเปลี่ยนเส้นทาง
  const [isLogin, setIsLogin] = useState(true); // Toggle ระหว่าง Login และ Sign Up


  // ฟังก์ชันสำหรับ Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      await login(username, password);
      router.push('/overview');
    } catch (err) {
      setError('Invalid username or password. Please try again.');
    }
  };

  // ฟังก์ชันสำหรับ Sign Up
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
      setIsLogin(true); // กลับไปหน้า Login หลังจาก Sign Up สำเร็จ
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="bg-white shadow-2xl rounded-lg p-6 sm:p-8 lg:p-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="/asset/png/bg-spc.png"
            alt="Company Logo"
            className="w-16 h-16 sm:w-20 sm:h-20"
          />
        </div>

        {/* Website Name */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-center text-gray-800 mb-4">
          {isLogin ? 'Login' : 'Sign Up'}
        </h1>
        <p className="text-center text-gray-500 text-sm sm:text-base mb-6">
          {isLogin
            ? 'Welcome back! Please login to your account.'
            : 'Create your account to get started.'}
        </p>

        {/* Form */}
        <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Login Form */}
          {isLogin && (
            <>
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
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
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
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
              {/* Submit Button */}
              <div>
                <button
                  onClick={handleLogin}
                  className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-bold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
                >
                  Sign Up
                </button>
              </div>
            </>
          )}

          {/* Sign Up Form */}
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

              {/* Submit Button */}
              <div>
                <button
                  onClick={handleSignup}
                  className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-bold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
                >
                  Sign Up
                </button>
              </div>
            </div>
          )}




          
        </form>

        {/* Toggle Login/Sign Up */}
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
          <a
            href="#"
            className="text-blue-400 hover:text-blue-600 font-medium transition-colors"
          >
            Privacy Policy
          </a>{' '}
          and{' '}
          <a
            href="#"
            className="text-blue-400 hover:text-blue-600 font-medium transition-colors"
          >
            Terms of Service
          </a>
          .
        </p>

        {/* Security Notice */}
        <div className="mt-6 bg-gray-50 border-t border-gray-200 py-4 px-6 rounded-lg text-sm text-gray-600">
          <p>
            🔒 Your credentials are securely encrypted and will not be shared with
            third parties.
          </p>
          <p className="mt-2">
            Need help? Contact{' '}
            <a
              href="mailto:support@company.com"
              className="text-blue-400 hover:text-blue-600 font-medium transition-colors"
            >
              support@company.com
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
