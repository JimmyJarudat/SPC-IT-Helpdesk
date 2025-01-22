'use client';
import { useState, useEffect } from "react";

const UserInfoPage = () => {
    const [users, setUsers] = useState([]); // ข้อมูลผู้ใช้งาน
    const [selectedUser, setSelectedUser] = useState(null); // ผู้ใช้งานที่เลือก
    const [search, setSearch] = useState(""); // ค่าค้นหา

    // ดึงข้อมูลผู้ใช้งาน 
    useEffect(() => {
        const fetchUsers = async () => {
            // จำลองข้อมูล
            const mockData = [
                { id: 1, name: "John Doe", ip: "192.168.1.10", status: "Online" },
                { id: 2, name: "Jane Smith", ip: "192.168.1.11", status: "Offline" },
                { id: 3, name: "Bob Johnson", ip: "192.168.1.12", status: "Online" },
            ];
            setUsers(mockData);
        };
        fetchUsers();
    }, []);

    // กรองข้อมูลตามการค้นหา
    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.ip.includes(search)
    );

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
            <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-6">
                รายละเอียดผู้ใช้งานคอมพิวเตอร์
            </h1>

            {/* ช่องค้นหา */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="ค้นหาผู้ใช้งานหรือ IP..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                />
            </div>

            {/* ตารางข้อมูล */}
            <div className="bg-white dark:bg-gray-800 shadow-md rounded">
                <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-700">
                    <thead>
                        <tr className="bg-gray-200 dark:bg-gray-700">
                            <th className="p-3 text-left text-gray-900 dark:text-gray-100">ชื่อผู้ใช้งาน</th>
                            <th className="p-3 text-left text-gray-900 dark:text-gray-100">IP Address</th>
                            <th className="p-3 text-left text-gray-900 dark:text-gray-100">สถานะ</th>
                            <th className="p-3 text-center text-gray-900 dark:text-gray-100">ดูรายละเอียด</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="border-t dark:border-gray-700">
                                <td className="p-3 text-gray-800 dark:text-gray-300">{user.name}</td>
                                <td className="p-3 text-gray-800 dark:text-gray-300">{user.ip}</td>
                                <td
                                    className={`p-3 font-bold ${
                                        user.status === "Online"
                                            ? "text-green-600 dark:text-green-400"
                                            : "text-red-600 dark:text-red-400"
                                    }`}
                                >
                                    {user.status}
                                </td>
                                <td className="p-3 text-center">
                                    <button
                                        onClick={() => setSelectedUser(user)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    >
                                        ดูข้อมูล
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal แสดงรายละเอียด */}
            {selectedUser && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                            ข้อมูลผู้ใช้งาน
                        </h2>
                        <p className="text-gray-800 dark:text-gray-300">
                            <strong>ชื่อผู้ใช้งาน:</strong> {selectedUser.name}
                        </p>
                        <p className="text-gray-800 dark:text-gray-300">
                            <strong>IP Address:</strong> {selectedUser.ip}
                        </p>
                        <p className="text-gray-800 dark:text-gray-300">
                            <strong>สถานะ:</strong>{" "}
                            <span
                                className={`font-bold ${
                                    selectedUser.status === "Online"
                                        ? "text-green-600 dark:text-green-400"
                                        : "text-red-600 dark:text-red-400"
                                }`}
                            >
                                {selectedUser.status}
                            </span>
                        </p>
                        <div className="mt-4 text-right">
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                ปิด
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserInfoPage;
