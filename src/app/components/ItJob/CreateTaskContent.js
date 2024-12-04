'use client'
import { useState, useEffect } from "react";
import { getColorFromTheme } from '@/utils/colorMapping';
import { useTheme } from "@/contexts/ThemeContext";
import { useUser } from "@/contexts/UserContext";


const CreateJob = () => {
    const { user } = useUser();
    const { theme } = useTheme();

    const [selectedTab, setSelectedTab] = useState("ทั่วไป");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [userInfo, setUserInfo] = useState(null);

    const [jobDetails, setJobDetails] = useState({
        jobName: "",
        jobDescription: "",
        category: "",
        

    });

    // ตรวจสอบเบอร์โทรเมื่อข้อมูลเปลี่ยนแปลง
    useEffect(() => {
        if (phoneNumber.length === 3) { // ตรวจสอบเฉพาะ 3 หลัก
            const fetchUserInfo = async () => {
                try {
                    const response = await fetch("/api/profile/profileupdate", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ phone: phoneNumber }), // ส่งเบอร์โทรไปยัง API
                    });

                    const result = await response.json();
                    console.log("API Response:", result); // Debug ผลลัพธ์

                    if (result.success) {
                        setUserInfo(result.data); // ตั้งค่าข้อมูลใน state
                    } else {
                        setUserInfo(null); // รีเซ็ตข้อมูลถ้าไม่มีผู้ใช้
                        console.error("Error message:", result.message);
                    }
                } catch (error) {
                    console.error("Error fetching user data by phone:", error);
                    setUserInfo(null);
                }
            };

            fetchUserInfo();
        } else {
            setUserInfo(null); // รีเซ็ตข้อมูลถ้าเบอร์โทรไม่ครบ 3 หลัก
        }
    }, [phoneNumber]); // ทำงานทุกครั้งเมื่อ phoneNumber เปลี่ยน


    // ฟังก์ชันจัดการเมื่อกดปุ่มบันทึก
    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            jobID: `IT${new Date().toISOString().slice(0, 7).replace("-", "")}${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`,
            phoneNumber,
            status: "in_progress",
            nameJob_owner: user.fullName,
            nicknameJob_owner: user.nickName,
            emailJob_owner: user.email,
            phoneJob_owner: user.phone,
            dateAcepJob_owner: new Date(),
            ...userInfo,
            ...jobDetails,
        };

        try {
            const response = await fetch("/api/it-job/createJob", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (result.success) {
                alert("บันทึกงานสำเร็จ!");
                // เคลียร์ฟอร์มหลังบันทึกสำเร็จ
                setPhoneNumber("");
                setUserInfo(null);
                setJobDetails({ jobName: "", jobDescription: "", category: "" });
            } else {
                alert(`เกิดข้อผิดพลาด: ${result.message}`);
            }
        } catch (error) {
            console.error("Error saving job:", error);
            alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        }
    };

    return (
        <div className="flex-1 min-h-screen overflow-auto bg-gray-100 dark:bg-gray-900 p-6">
            <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg p-6 dark:bg-gray-800">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                    บันทึกรับแจ้งงาน
                </h2>

                {/* Tabs */}
                <div className="flex mb-6 border-b border-gray-300 dark:border-gray-700">
                    <button
                        onClick={() => setSelectedTab("ทั่วไป")}
                        style={{
                            color: selectedTab === "ทั่วไป" ? getColorFromTheme(theme.primaryColor, theme.primaryWeight) : "#6b7280", // สีตัวอักษร
                            borderBottom: selectedTab === "ทั่วไป" ? `2px solid ${getColorFromTheme(theme.primaryColor, theme.primaryWeight)}` : "none", // เส้นใต้
                        }}

                        className="py-2 px-4  hover:opacity-80 text-sm font-medium"
                    >
                        ทั่วไป
                    </button>
                    <button
                        onClick={() => setSelectedTab("งานประจำ")}
                        style={{
                            color: selectedTab === "งานประจำ" ? getColorFromTheme(theme.primaryColor, theme.primaryWeight) : "#6b7280", // สีตัวอักษร
                            borderBottom: selectedTab === "งานประจำ" ? `2px solid ${getColorFromTheme(theme.primaryColor, theme.primaryWeight)}` : "none", // เส้นใต้
                        }}

                        className="py-2 px-4  hover:opacity-80 text-sm font-medium"
                    >
                        งานประจำ
                    </button>
                </div>

                {selectedTab === "ทั่วไป" && (
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
                        {/* เบอร์โทร */}
                        <div className="flex flex-col">
                            <label className="text-gray-700 dark:text-gray-300 font-medium">เบอร์โทร</label>
                            <input
                                type="text"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                                placeholder="กรอกเบอร์โทร (3 หลัก)"
                            />
                        </div>

                        {/* ข้อมูลผู้ใช้งาน */}
                        {userInfo && (
                            <>
                                <div className="flex flex-col">
                                    <label className="text-gray-700 dark:text-gray-300 font-medium">บริษัท</label>
                                    <input
                                        type="text"
                                        value={userInfo.company}
                                        readOnly
                                        className="w-full p-2 border border-gray-300 rounded bg-gray-100 dark:bg-gray-700 dark:text-gray-300"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-gray-700 dark:text-gray-300 font-medium">สถานที่</label>
                                    <input
                                        type="text"
                                        value={userInfo.location}
                                        readOnly
                                        className="w-full p-2 border border-gray-300 rounded bg-gray-100 dark:bg-gray-700 dark:text-gray-300"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-gray-700 dark:text-gray-300 font-medium">ชื่อเครื่อง</label>
                                    <input
                                        type="text"
                                        value={userInfo.computerName}
                                        readOnly
                                        className="w-full p-2 border border-gray-300 rounded bg-gray-100 dark:bg-gray-700 dark:text-gray-300"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-gray-700 dark:text-gray-300 font-medium">ชื่อ-สกุล</label>
                                    <input
                                        type="text"
                                        value={userInfo.fullName}
                                        readOnly
                                        className="w-full p-2 border border-gray-300 rounded bg-gray-100 dark:bg-gray-700 dark:text-gray-300"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-gray-700 dark:text-gray-300 font-medium">ชื่อเล่น</label>
                                    <input
                                        type="text"
                                        value={userInfo.nickName}
                                        readOnly
                                        className="w-full p-2 border border-gray-300 rounded bg-gray-100 dark:bg-gray-700 dark:text-gray-300"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-gray-700 dark:text-gray-300 font-medium">ตำแหน่ง</label>
                                    <input
                                        type="text"
                                        value={userInfo.position}
                                        readOnly
                                        className="w-full p-2 border border-gray-300 rounded bg-gray-100 dark:bg-gray-700 dark:text-gray-300"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-gray-700 dark:text-gray-300 font-medium">ฝ่าย</label>
                                    <input
                                        type="text"
                                        value={userInfo.division}
                                        readOnly
                                        className="w-full p-2 border border-gray-300 rounded bg-gray-100 dark:bg-gray-700 dark:text-gray-300"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-gray-700 dark:text-gray-300 font-medium">แผนก</label>
                                    <input
                                        type="text"
                                        value={userInfo.department}
                                        readOnly
                                        className="w-full p-2 border border-gray-300 rounded bg-gray-100 dark:bg-gray-700 dark:text-gray-300"
                                    />
                                </div>
                            </>
                        )}

                        {/* ชื่องาน */}
                        <div className="flex flex-col md:col-span-2">
                            <label className="text-gray-700 dark:text-gray-300 font-medium">ชื่องาน</label>
                            <input
                                type="text"
                                value={jobDetails.jobName}
                                onChange={(e) => setJobDetails({ ...jobDetails, jobName: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                                placeholder="ระบุชื่องาน"
                            />
                        </div>

                        {/* รายละเอียด */}
                        <div className="flex flex-col md:col-span-2">
                            <label className="text-gray-700 dark:text-gray-300 font-medium">รายละเอียด</label>
                            <textarea
                                value={jobDetails.jobDescription}
                                onChange={(e) => setJobDetails({ ...jobDetails, jobDescription: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                                placeholder="ระบุรายละเอียด"
                            ></textarea>
                        </div>
                        {/* ประเภทงาน */}
                        <div className="flex flex-col md:col-span-2">
                            <label className="text-gray-700 dark:text-gray-300 font-medium">ประเภทงาน</label>
                            <div className="flex space-x-4">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="category"
                                        value="device"
                                        onChange={(e) => setJobDetails({ ...jobDetails, category: e.target.value })}
                                    />
                                    <span className="text-gray-700 dark:text-gray-300">อุปกรณ์</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="category"
                                        value="program"
                                        onChange={(e) => setJobDetails({ ...jobDetails, category: e.target.value })}
                                    />
                                    <span className="text-gray-700 dark:text-gray-300">โปรแกรม</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="category"
                                        value="user"
                                        onChange={(e) => setJobDetails({ ...jobDetails, category: e.target.value })}
                                    />
                                    <span className="text-gray-700 dark:text-gray-300">ผู้ใช้งาน</span>
                                </label>
                            </div>
                        </div>

                        {/* ปุ่มบันทึก */}
                        <div className="md:col-span-2 flex justify-end">
                            <button
                                type="submit"
                                className="bg-blue-500 text-white font-medium px-6 py-2 rounded hover:bg-blue-600 dark:hover:bg-blue-700"
                            >
                                บันทึกงาน
                            </button>
                        </div>
                    </form>
                )}






            </div>
        </div>
    );
}

export default CreateJob;
