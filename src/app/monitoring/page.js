'use client';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe, faCheckCircle, faTimesCircle, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

const StatusPage = () => {
    const [results, setResults] = useState([]);
    const [loadingStates, setLoadingStates] = useState({});
    const [currentEditingIndex, setCurrentEditingIndex] = useState(null);
    const [tempCredentials, setTempCredentials] = useState({ username: '', password: '' });
    const [customCredentials, setCustomCredentials] = useState({}); const [summary, setSummary] = useState({
        total: 0,
        online: 0,
        failed: 0,
        loginFailed: [],
    });

    const websites = [
        {
            name: 'IT Profile',
            url: 'https://it.profile.co.th/login',
            usernameSelector: 'input[name="username"]',
            passwordSelector: 'input[name="password"]',
            buttonSelector: 'button.btn.btn-primary.btn-block',
            userInfoSelector: 'span.hidden-xs',
        },
        {
            name: 'Carton Web System (User)',
            url: 'https://carton.profile.co.th/user/login',
            usernameSelector: 'input[name="login-form[login]"]',
            passwordSelector: 'input[name="login-form[password]"]',
            buttonSelector: 'button.btn.btn-primary.btn-block',
            userInfoSelector: 'span.hidden-xs',
        },
        {
            name: 'IT Profile',
            url: 'https://it.profile.co.th/login',
            usernameSelector: 'input[name="username"]',
            passwordSelector: 'input[name="password"]',
            buttonSelector: 'button.btn.btn-primary.btn-block',
            userInfoSelector: 'span.hidden-xs',
        },

    ];



    const fetchStatusForWebsite = async (index, updatedCredentials = customCredentials) => {
        const website = websites[index];
        setLoadingStates((prev) => ({ ...prev, [index]: true }));

        try {
            const response = await fetch('/api/monitoring/webstatusLogin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    websites: [website],
                    credentials: updatedCredentials
                }),
            });
            const data = await response.json();

            setResults((prev) => {
                const updatedResults = [...prev];
                updatedResults[index] = data.results[0];
                calculateSummary(updatedResults); // คำนวณสรุปหลังจากอัปเดต
                return updatedResults;
            });
        } catch (error) {
            console.error(`Error loading status for ${website.name}:`, error);
        } finally {
            setLoadingStates((prev) => ({ ...prev, [index]: false }));
        }
    };

    const calculateSummary = (updatedResults) => {
        const total = websites.length;
        const online = updatedResults.filter(
            (res) => res && res.websiteStatus === 'ออนไลน์ปกติ'
        ).length;
        const failed = updatedResults.filter(
            (res) => res && res.websiteStatus !== 'ออนไลน์ปกติ'
        ).length;
        const loginFailed = updatedResults
            .map((res, idx) => {
                if (res && res.loginStatus !== 'ล็อกอินสำเร็จ') {
                    return res.name || websites[idx].name || "ไม่ทราบชื่อเว็บไซต์";
                }
                return null;
            })
            .filter((name) => name); // กรองค่า null ออก

        setSummary({
            total,
            online,
            failed,
            loginFailed,
        });
    };



    useEffect(() => {
        const initializeResults = Array(websites.length).fill(null);
        setResults(initializeResults);

        websites.forEach((_, index) => {
            fetchStatusForWebsite(index);
        });
    }, []);

    // ฟังก์ชันเปิดป๊อปอัป
    const openEditPopup = (index) => {
        setCurrentEditingIndex(index);
        setTempCredentials({ username: '', password: '' }); // ล้างข้อมูลเมื่อเปิดใหม่
    };

    const saveCredentials = async () => {
        if (currentEditingIndex !== null) {
            const website = websites[currentEditingIndex];

            // อัปเดต customCredentials
            const updatedCredentials = {
                ...customCredentials,
                [website.name]: {
                    username: tempCredentials.username,
                    password: tempCredentials.password,
                },
            };
            setCustomCredentials(updatedCredentials);

            // ปิดป๊อปอัปทันที
            setCurrentEditingIndex(null);
            setTempCredentials({ username: '', password: '' });

            // เรียก fetchStatusForWebsite หลังจากปิดป๊อปอัป
            await fetchStatusForWebsite(currentEditingIndex, updatedCredentials);
        }
    };




    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">สถานะระบบ</h1>

            {/* ส่วนสรุป */}
            <div className="w-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
                    สรุปสถานะเว็บไซต์
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {/* เว็บไซต์ทั้งหมด */}
                    <div className="flex items-center space-x-4 p-5 bg-blue-100 dark:bg-blue-900 rounded-lg shadow">
                        <div className="text-blue-600 dark:text-blue-300 text-4xl">
                            <FontAwesomeIcon icon={faGlobe} />
                        </div>
                        <div>
                            <p className="text-lg font-medium text-gray-600 dark:text-gray-400">เว็บไซต์ทั้งหมด</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                {summary.total}
                            </p>
                        </div>
                    </div>
                    {/* ออนไลน์ปกติ */}
                    <div className="flex items-center space-x-4 p-5 bg-green-100 dark:bg-green-900 rounded-lg shadow">
                        <div className="text-green-600 dark:text-green-300 text-4xl">
                            <FontAwesomeIcon icon={faCheckCircle} />
                        </div>
                        <div>
                            <p className="text-lg font-medium text-gray-600 dark:text-gray-400">ออนไลน์ปกติ</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                {summary.online}
                            </p>
                        </div>
                    </div>
                    {/* ล้มเหลว */}
                    <div className="flex items-center space-x-4 p-5 bg-red-100 dark:bg-red-900 rounded-lg shadow">
                        <div className="text-red-600 dark:text-red-300 text-4xl">
                            <FontAwesomeIcon icon={faTimesCircle} />
                        </div>
                        <div>
                            <p className="text-lg font-medium text-gray-600 dark:text-gray-400">ล้มเหลว</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                {summary.failed}
                            </p>
                        </div>
                    </div>
                    {/* ล็อกอินไม่สำเร็จ */}
                    <div className="flex items-center space-x-4 p-5 bg-yellow-100 dark:bg-yellow-900 rounded-lg shadow">
                        <div className="text-yellow-600 dark:text-yellow-300 text-4xl">
                            <FontAwesomeIcon icon={faExclamationCircle} />
                        </div>
                        <div>
                            <p className="text-lg font-medium text-gray-600 dark:text-gray-400">ล็อกอินไม่สำเร็จ</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                {summary.loginFailed.length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow">
                    <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-2">
                        รายละเอียดเว็บไซต์ที่ล็อกอินไม่สำเร็จ:
                    </h3>
                    <ul className="list-disc pl-6">
                        {summary.loginFailed.length > 0 ? (
                            summary.loginFailed.map((name, idx) => (
                                <li key={idx} className="text-red-500 dark:text-red-300 text-lg">
                                    {name}
                                </li>
                            ))
                        ) : (
                            <li className="text-gray-500 dark:text-gray-400 text-lg">
                                ไม่มีเว็บไซต์ที่ล็อกอินไม่สำเร็จ
                            </li>
                        )}
                    </ul>
                </div>
            </div>



            {/* การ์ดแสดงสถานะ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {websites.map((website, index) => (
                    <div
                        key={index}
                        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col justify-between space-y-4"
                    >
                        <p className="text-lg font-medium text-gray-700 dark:text-gray-200 truncate">
                            ชื่อเว็บไซต์:
                            <span className="ml-2 font-bold text-blue-500">{website.name}</span>
                        </p>
                        {loadingStates[index] ? (
                            <div className="flex flex-col items-center justify-center h-40">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
                                <p className="text-lg text-gray-500 dark:text-gray-400 mt-4">กำลังโหลด...</p>
                            </div>
                        ) : results[index] ? (
                            <div className="flex flex-col space-y-2">
                                <p className="text-lg font-medium text-gray-700 dark:text-gray-200 truncate">
                                    สถานะเว็บไซต์:
                                    <span
                                        className={`ml-2 font-bold ${results[index].websiteStatus === 'ออนไลน์ปกติ'
                                            ? 'text-green-500'
                                            : 'text-red-500'
                                            }`}
                                    >
                                        {results[index].websiteStatus}
                                    </span>
                                </p>
                                <p className="text-lg font-medium text-gray-700 dark:text-gray-200 truncate">
                                    สถานะล็อกอิน:
                                    <span
                                        className={`ml-2 font-bold ${results[index].loginStatus === 'ล็อกอินสำเร็จ'
                                            ? 'text-green-500'
                                            : 'text-red-500'
                                            }`}
                                    >
                                        {results[index].loginStatus}
                                    </span>
                                </p>
                                <p className="text-lg font-medium text-gray-700 dark:text-gray-200 truncate">
                                    ข้อมูลผู้ใช้:
                                    <span className="ml-2 font-bold text-blue-500">{results[index].userInfo}</span>
                                </p>
                                <p className="text-lg font-medium text-gray-700 dark:text-gray-200 truncate">
                                    URL ก่อนล็อกอิน:
                                    <span
                                        className="ml-2 font-bold text-blue-500 underline tooltip"
                                        title={results[index].beforeLoginUrl || 'ไม่สามารถดึงข้อมูลได้'}
                                    >
                                        <a
                                            href={results[index].beforeLoginUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {results[index].beforeLoginUrl || 'ไม่สามารถดึงข้อมูลได้'}
                                        </a>
                                    </span>
                                </p>
                                <p className="text-lg font-medium text-gray-700 dark:text-gray-200 truncate">
                                    URL หลังล็อกอิน:
                                    <span
                                        className="ml-2 font-bold text-blue-500 underline tooltip"
                                        title={results[index].afterLoginUrl || 'ไม่สามารถดึงข้อมูลได้'}
                                    >
                                        <a
                                            href={results[index].afterLoginUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {results[index].afterLoginUrl || 'ไม่สามารถดึงข้อมูลได้'}
                                        </a>
                                    </span>
                                </p>
                            </div>
                        ) : (
                            <p className="text-lg text-gray-500 dark:text-gray-400 truncate">ยังไม่มีข้อมูล</p>
                        )}
                        <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col space-y-4">
                            {/* เนื้อหาอื่นๆ */}
                            <div className="flex justify-between mt-4">
                                <button
                                    onClick={() => fetchStatusForWebsite(index)}
                                    className="bg-blue-500 text-white font-bold py-2 px-4 rounded shadow hover:bg-blue-600 transition duration-300"
                                >
                                    ทดสอบอีกครั้ง
                                </button>
                                <button
                                    onClick={() => openEditPopup(index)}
                                    className="bg-yellow-500 text-white font-bold py-2 px-4 rounded shadow hover:bg-yellow-600 transition duration-300"
                                >
                                    เปลี่ยนบัญชี
                                </button>
                            </div>
                        </div>

                    </div>
                ))}
            </div>

            {currentEditingIndex !== null && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded shadow-lg w-96">
                        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
                            เปลี่ยนบัญชี - {websites[currentEditingIndex].name}
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block mb-2 text-gray-700 dark:text-gray-300">ชื่อผู้ใช้</label>
                                <input
                                    type="text"
                                    value={tempCredentials.username}
                                    onChange={(e) => setTempCredentials(prev => ({ ...prev, username: e.target.value }))}
                                    className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-gray-700 dark:text-gray-300">รหัสผ่าน</label>
                                <input
                                    type="password"
                                    value={tempCredentials.password}
                                    onChange={(e) => setTempCredentials(prev => ({ ...prev, password: e.target.value }))}
                                    className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                                />
                            </div>
                            <div className="flex justify-end space-x-4 mt-6">
                                <button
                                    onClick={() => setCurrentEditingIndex(null)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    onClick={saveCredentials}
                                    disabled={!tempCredentials.username || !tempCredentials.password}
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 disabled:bg-blue-300 disabled:cursor-not-allowed"
                                >
                                    บันทึก
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StatusPage;
