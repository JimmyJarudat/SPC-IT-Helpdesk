'use client'
import { useState, useEffect } from "react";
import { getColorFromTheme } from '@/utils/colorMapping';
import { useTheme } from "@/contexts/ThemeContext";
import { useUser } from "@/contexts/UserContext";
import { FaDatabase, FaPoo, FaFileVideo, FaAudioDescription } from "react-icons/fa";
import { FaDesktop, FaCamera, FaServer, FaNetworkWired, FaPrint, FaBatteryFull } from "react-icons/fa";




const CreateJob = () => {
    const { user } = useUser();

    const { theme } = useTheme();
    const [loading, setLoading] = useState(true);
    const [userOptions, setUserOptions] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedTag, setSelectedTag] = useState("");

    const [tasks, setTasks] = useState([]);
    const [selectedTab, setSelectedTab] = useState("ทั่วไป");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [userInfo, setUserInfo] = useState(null);
    const [isModalOpenDaily, setIsModalOpenDaily] = useState(false); // สถานะของ Modal
    const [isModalOpen, setIsModalOpen] = useState(false); // สถานะของ Modal
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const [errors, setErrors] = useState({
        phoneNumber: false,
        jobName: false,
        category: false,
    });

    const [errorMessages, setErrorMessages] = useState({
        phoneNumber: "",
        jobName: "",
        category: "",
    });
    const [selectedTask, setSelectedTask] = useState(null); // งานที่เลือก

    const [jobDetails, setJobDetails] = useState({
        jobName: "",
        jobDescription: "",
        category: "",
        tag: "",


    });

    useEffect(() => {
        if (jobDetails.category === "device") {
            setTags(["คอมพิวเตอร์", "ปริ้นเตอร์", "เครือข่าย", "กล้องวงจรปิด"]);
        } else if (jobDetails.category === "program") {
            setTags(["Microsoft Office", "Power BI", "โปรแกรมบัญชี", "โปรแกรมออกแบบ"]);
        } else if (jobDetails.category === "user") {
            setTags(["สร้างบัญชีใหม่", "รีเซ็ตรหัสผ่าน", "จัดการสิทธิ์", "อบรมผู้ใช้งาน"]);
        } else {
            setTags([]);
        }
        setSelectedTag(""); // รีเซ็ตค่าแท็กเมื่อเปลี่ยนประเภทงาน
    }, [jobDetails.category]);


    const getIconForTask = (taskName) => {
        switch (taskName) {
            case "ตรวจสอบกล้องวงจรปิด":
                return <FaFileVideo className="text-blue-500 text-2xl" />;
            case "อัพเดทฐานข้อมูล Power Bi":
                return <FaDatabase className="text-green-500 text-2xl" />;
            case "Backup ข้อมูลรายวัน":
                return <FaDatabase className="text-yellow-500 text-2xl" />;
            case "จัดเก็บไฟล์เสียง":
                return <FaAudioDescription className="text-cyan-500 text-2xl" />;
            default:
                return <FaPoo className="text-pink-500 text-2xl" />;
        }
    };

    // ตรวจสอบเบอร์โทรเมื่อข้อมูลเปลี่ยนแปลง
    useEffect(() => {
        if (phoneNumber.trim().length === 3) {
            const fetchUserInfo = async () => {
                try {
                    const response = await fetch("/api/profile/profileupdate", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ phone: phoneNumber }),
                    });

                    const result = await response.json();

                    if (result.success) {
                        if (result.data.length === 1) {
                            // ถ้าผู้ใช้คนเดียว ให้ตั้งค่า userInfo ทันที
                            setUserInfo(result.data[0]);
                        } else {
                            // ถ้ามีหลายคน ให้แสดง Modal ให้เลือก
                            setUserInfo(null);
                            setUserOptions(result.data); // บันทึกรายการผู้ใช้
                            setIsModalOpen(true); // เปิด Modal
                        }
                    } else {
                        setUserInfo(null);
                        setErrors({ ...errors, phoneNumber: true });
                        setErrorMessages({ ...errorMessages, phoneNumber: result.message });
                    }
                } catch (error) {
                    setUserInfo(null);
                    setErrors({ ...errors, phoneNumber: true });
                    setErrorMessages({ ...errorMessages, phoneNumber: "เกิดข้อผิดพลาดในการเชื่อมต่อกับระบบ" });
                }
            };

            fetchUserInfo();
        }
    }, [phoneNumber]);

    // ฟังก์ชันจัดการเมื่อกดปุ่มบันทึก
    const handleSubmit = async (e) => {
        e.preventDefault();

        // ตรวจสอบข้อผิดพลาด
        const newErrors = {
            phoneNumber: !phoneNumber.trim(),
            jobName: !jobDetails.jobName.trim(),
            category: !jobDetails.category.trim(),
            tag: !jobDetails.tag.trim(),
        };

        const newErrorMessages = {
            phoneNumber: !phoneNumber.trim() ? "กรุณากรอกเบอร์โทร" : "",
            jobName: !jobDetails.jobName.trim() ? "กรุณากรอกชื่องาน" : "",
            category: !jobDetails.category.trim() ? "กรุณาเลือกประเภทงาน" : "",
            tag: !jobDetails.tag.trim() ? "กรุณาเลือกแท็ก" : "",
        };

        setErrors(newErrors);
        setErrorMessages(newErrorMessages);

        if (newErrors.phoneNumber || newErrors.jobName || newErrors.category) {
            setAlertMessage("กรุณากรอกข้อมูลให้ครบถ้วน");
            setIsAlertOpen(true);
            return;
        }

        if (newErrors.phoneNumber || newErrors.jobName || newErrors.category || newErrors.tag) {
            return; // หยุดการทำงานถ้ามีข้อผิดพลาด
        }

        // คำนวณ dueDate
        const status = user.role === "admin" ? "in_progress" : "pending";
        let dueDate = new Date();
        if (jobDetails.category === "user") {
            dueDate.setHours(dueDate.getHours() + 1);
        } else if (jobDetails.category === "program") {
            dueDate.setHours(dueDate.getHours() + 4);
        } else if (jobDetails.category === "device") {
            dueDate.setHours(dueDate.getHours() + 72);
        }

        const payload = {
            jobID: `IT${new Date().toISOString().slice(0, 7).replace("-", "")}${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`,
            phoneNumber,
            email: userInfo?.email || "",
            status,
            nameJob_owner: user.fullName,
            nicknameJob_owner: user.nickName,
            emailJob_owner: user.email || null,
            phoneJob_owner: user.phone,
            dateAcepJob_owner: new Date().toISOString(),
            dueDate: dueDate.toISOString(),
            tag: "",
            ...userInfo,
            ...jobDetails,
        };

        try {
            const response = await fetch("/api/it-job/createJob", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (result.success) {
                alert("บันทึกงานสำเร็จ!");
                setPhoneNumber("");
                setUserInfo(null);
                setJobDetails({ jobName: "", jobDescription: "", category: "", tag: "" });
                setErrors({ phoneNumber: false, jobName: false, category: false, tag: false });
            } else {
                alert(`เกิดข้อผิดพลาด: ${result.message}`);
            }
        } catch (error) {
            console.error("Error saving job:", error);
            alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        }
    };


    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch("/api/it-job/creactDailyJob", {
                    method: "POST",
                });
                const result = await response.json();

                if (result.success) {
                    const allTasks = result.tasksToCreate.map((task) => ({
                        name: task.name,
                        isOpen: false,
                    }));
                    setTasks(allTasks);
                }
            } catch (error) {
                console.error("Error fetching tasks:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);


        

    const handleCloseModal = () => {
        setSelectedTask(null);
        setIsModalOpen(false);
    };


    const handleCloseModalDaily = () => {
        setSelectedTask(null);
        setIsModalOpenDaily(false);
    };
   
    const handleOpenModalDaily = (task) => {
        setSelectedTask(task);
        setIsModalOpenDaily(true);
        setIsModalOpen(false); // ปิด Modal อื่น
    };
    
    const handleConfirmJobDaily = async (taskName) => {
        if (selectedTask) {
            try {
                const dueDate = new Date(
                    new Date().getFullYear(),
                    new Date().getMonth(),
                    new Date().getDate(),
                    17, // ชั่วโมง (UTC)
                    0,  // นาที
                    0,  // วินาที
                    0   // มิลลิวินาที
                ).toISOString()

                const response = await fetch("/api/it-job/createJob", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        jobName: selectedTask.name,
                        jobID: `IT${new Date().toISOString().slice(0, 7).replace("-", "")}${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`,

                        phoneNumber: user.phone,
                        email: user.email,
                        status: "in_progress",
                        nameJob_owner: user.fullName,
                        nicknameJob_owner: user.nickName,
                        emailJob_owner: user.email || null,
                        phoneJob_owner: user.phone,
                        dateAcepJob_owner: new Date().toISOString(),

                        createdAt: new Date().toISOString(),
                        company: user.company,
                        location: user.location,
                        computerName: user.computerName,
                        position: user.position,
                        fullName: user.fullName || "",
                        nickName: user.nickName || "",
                        division: user.division || "",
                        department: user.department || "",
                        category: "daily",
                        dueDate,
                        tag: "งานประจำ",

                    }),
                });

                const result = await response.json();
                if (result.success) {
                    alert(`เปิดงาน "${taskName}" สำเร็จ`);
                    setTasks((prevTasks) =>
                        prevTasks.filter((task) => task.name !== selectedTask.name)
                    );
                } else {
                    alert(`เกิดข้อผิดพลาด: ${result.message}`);
                }
            } catch (error) {
                console.error("Error opening task:", error);
                alert("เกิดข้อผิดพลาดในการเปิดงาน");
            } finally {
                handleCloseModalDaily();
            }
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
                            <label className="text-gray-700 dark:text-gray-300 font-medium">
                                เบอร์โทร <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={phoneNumber}
                                onChange={(e) => {
                                    setPhoneNumber(e.target.value);
                                    setErrors({ ...errors, phoneNumber: false });
                                    setErrorMessages({ ...errorMessages, phoneNumber: "" });
                                }}
                                className={`w-full p-2 border rounded dark:bg-gray-800 dark:text-gray-300 ${errors.phoneNumber ? "border-red-500 dark:border-red-500" : "border-gray-300 dark:border-gray-700"
                                    }`}
                                placeholder="กรอกเบอร์โทร (3 หลัก)"
                            />
                            {errors.phoneNumber && (
                                <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errorMessages.phoneNumber}</p>
                            )}
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
                            <label className="text-gray-700 dark:text-gray-300 font-medium">
                                ชื่องาน <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={jobDetails.jobName}
                                onChange={(e) => {
                                    setJobDetails({ ...jobDetails, jobName: e.target.value });
                                    setErrors({ ...errors, jobName: false });
                                    setErrorMessages({ ...errorMessages, jobName: "" });
                                }}
                                className={`w-full p-2 border rounded dark:bg-gray-800 dark:text-gray-300 ${errors.jobName ? "border-red-500 dark:border-red-500" : "border-gray-300 dark:border-gray-700"
                                    }`}
                                placeholder="ระบุชื่องาน"
                            />
                            {errors.jobName && (
                                <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errorMessages.jobName}</p>
                            )}
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
                            <label className="text-gray-700 dark:text-gray-300 font-medium">
                                ประเภทงาน <span className="text-red-500">*</span>
                            </label>
                            <div className="flex space-x-4">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="category"
                                        value="device"
                                        onChange={(e) => {
                                            setJobDetails({ ...jobDetails, category: e.target.value });
                                            setErrors({ ...errors, category: false });
                                            setErrorMessages({ ...errorMessages, category: "" });
                                        }}
                                    />
                                    <span className="text-gray-700 dark:text-gray-300">อุปกรณ์</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="category"
                                        value="program"
                                        onChange={(e) => {
                                            setJobDetails({ ...jobDetails, category: e.target.value });
                                            setErrors({ ...errors, category: false });
                                            setErrorMessages({ ...errorMessages, category: "" });
                                        }}
                                    />
                                    <span className="text-gray-700 dark:text-gray-300">โปรแกรม</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="category"
                                        value="user"
                                        onChange={(e) => {
                                            setJobDetails({ ...jobDetails, category: e.target.value });
                                            setErrors({ ...errors, category: false });
                                            setErrorMessages({ ...errorMessages, category: "" });
                                        }}
                                    />
                                    <span className="text-gray-700 dark:text-gray-300">ผู้ใช้งาน</span>
                                </label>
                            </div>
                            {errors.category && (
                                <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errorMessages.category}</p>
                            )}
                        </div>
                        {/* แท็ก */}
                        {tags.length > 0 && (
                            <div className="flex flex-col md:col-span-1">
                                <label className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                                    แท็ก <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        value={selectedTag}
                                        onChange={(e) => {
                                            setSelectedTag(e.target.value);
                                            setJobDetails({ ...jobDetails, tag: e.target.value });
                                            setErrors({ ...errors, tag: false });
                                            setErrorMessages({ ...errorMessages, tag: "" });
                                        }}
                                        className={`w-full p-3 border rounded-lg bg-white shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 ${errors.tag ? "border-red-500 dark:border-red-500" : "border-gray-300 dark:border-gray-700"
                                            }`}
                                    >
                                        <option value="" disabled>
                                            -- เลือกแท็ก --
                                        </option>
                                        {tags.map((tag, index) => (
                                            <option key={index} value={tag}>
                                                {tag}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {errors.tag && (
                                    <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errorMessages.tag}</p>
                                )}
                            </div>
                        )}



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


                {selectedTab === "งานประจำ" && (
                    <div className="min-h-screen bg-white dark:bg-gray-800 p-6">
                        <div className="max-w-5xl mx-auto bg-white   dark:bg-gray-800">
                            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">
                                บันทึกงานประจำ
                            </h2>

                            {tasks.length > 0 ? (
                                <div className="space-y-4">
                                    {tasks.map((task, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                                        >
                                            <div className="flex items-center space-x-4">
                                                {/* แสดงไอคอน */}
                                                {getIconForTask(task.name)}
                                                {/* ชื่อชื่องาน */}
                                                <span className="text-lg font-medium text-gray-800 dark:text-white">
                                                    {task.name}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => handleOpenModalDaily(task)}
                                                className="px-5 py-2 font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-800 transition-all"
                                            >
                                                เปิดงาน
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-600 dark:text-gray-300 text-lg mt-6">
                                    งานประจำถูกเปิดครบแล้ว 🎉
                                </p>
                            )}
                        </div>

                        {/* Modal ยืนยัน */}
                        {isModalOpenDaily && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg mx-auto dark:bg-gray-800">
                                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 text-center">
                                        ยืนยันการเปิดงาน
                                    </h3>
                                    <p className="text-gray-700 dark:text-gray-300 mb-6 text-center">
                                        คุณต้องการเปิดงาน <span className="font-bold">{selectedTask?.name}</span> ใช่หรือไม่?
                                    </p>
                                    <div className="flex justify-center space-x-4">
                                        <button
                                            onClick={handleCloseModalDaily}
                                            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-700 transition-all"
                                        >
                                            ยกเลิก
                                        </button>
                                        <button
                                            onClick={handleConfirmJobDaily}
                                            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:ring-2 focus:ring-green-300 dark:focus:ring-green-700 transition-all"
                                        >
                                            ยืนยัน
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                )}






                {isAlertOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
                        <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-auto dark:bg-gray-800 animate-fade-in-down">
                            {/* ไอคอนแจ้งเตือน */}
                            <div className="flex items-center justify-center mb-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-12 w-12 text-red-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9S3 16.97 3 12 7.03 3 12 3s9 4.03 9 9z"
                                    />
                                </svg>
                            </div>
                            {/* หัวข้อ */}
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 text-center">
                                แจ้งเตือน
                            </h3>
                            {/* ข้อความ */}
                            <p className="text-gray-700 dark:text-gray-300 mb-6 text-center">
                                {alertMessage}
                            </p>
                            {/* ปุ่มปิด */}
                            <div className="flex justify-center">
                                <button
                                    onClick={() => setIsAlertOpen(false)}
                                    className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-800 transition-all"
                                >
                                    ปิด
                                </button>
                            </div>
                        </div>
                    </div>
                )}


                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
                        <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full mx-auto dark:bg-gray-800 relative">
                            {/* Close Button */}
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            >
                                ✕
                            </button>

                            {/* Header */}
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
                                เลือกผู้ใช้งาน
                            </h3>

                            {/* User List */}
                            <div className="space-y-4">
                                {userOptions.map((user, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 dark:bg-gray-700 shadow hover:shadow-lg cursor-pointer transition-all"
                                        onClick={() => {
                                            setUserInfo(user); // บันทึกผู้ใช้ที่เลือก
                                            setIsModalOpen(false); // ปิด Modal
                                        }}
                                    >
                                        {/* User Info */}
                                        <div>
                                            <p className="text-lg font-bold text-gray-800 dark:text-white">
                                                {user.fullName}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                ชื่อเล่น: {user.nickName}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                แผนก: {user.department}
                                            </p>
                                        </div>
                                        {/* Select Icon */}
                                        <div className="text-blue-500 dark:text-blue-400">
                                            ➜
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer */}
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 dark:hover:bg-red-700 transition-all"
                                >
                                    ยกเลิก
                                </button>
                            </div>
                        </div>
                    </div>
                )}




            </div>
        </div>
    );
}

export default CreateJob;
