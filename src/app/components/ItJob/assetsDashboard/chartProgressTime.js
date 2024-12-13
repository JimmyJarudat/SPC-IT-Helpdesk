export const progressTime = (jobs, activeFilter, date, isDarkMode, adjustTimezone, selectedCategories) => {
    const labels = [];
    const taskCounts = [];
    let chartData = { labels: [], datasets: [] };

    const categoryData = {
        device: { totalHours: 0, taskCount: 0 },
        program: { totalHours: 0, taskCount: 0 },
        user: { totalHours: 0, taskCount: 0 },
        daily: { totalHours: 0, taskCount: 0 },
    };

    if (activeFilter === "Yearly") {
        const months = Array.from({ length: 12 }, (_, i) =>
            new Date(date.getFullYear(), i, 1).toLocaleString("default", { month: "long" })
        );
        const categoryCounts = months.reduce((acc, month) => {
            acc[month] = { device: 0, program: 0, user: 0, daily: 0 };
            return acc;
        }, {});

        jobs.forEach((job) => {
            const jobDate = new Date(job.createdAt);
            const month = jobDate.toLocaleString("default", { month: "long" });
            const category = job.category?.toLowerCase();
            const isSelected = selectedCategories[category?.charAt(0).toUpperCase() + category?.slice(1)];
            const processTime = parseProcessTime(job.processTime);

            if (isSelected && categoryCounts[month][category] !== undefined) {
                categoryCounts[month][category] += processTime;
                categoryData[category].totalHours += processTime;
                categoryData[category].taskCount += 1;
            }
        });

        labels.push(...Object.keys(categoryCounts));
        taskCounts.push(
            ...labels.map(
                (month) =>
                    (selectedCategories.Device ? categoryCounts[month].device : 0) +
                    (selectedCategories.Program ? categoryCounts[month].program : 0) +
                    (selectedCategories.User ? categoryCounts[month].user : 0) +
                    (selectedCategories.Daily ? categoryCounts[month].daily : 0)
            )
        );

        const monthColors = [
            "#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#9333EA", "#06B6D4",
            "#EA580C", "#4ADE80", "#A855F7", "#22D3EE", "#F43F5E", "#D97706",
        ];

        chartData = {
            labels,
            datasets: [
                {
                    label: "Total Tasks",
                    data: taskCounts,
                    backgroundColor: monthColors,
                    hoverBackgroundColor: "#2563eb",
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                const total = `📊 Total: ${context.raw}`;
                                const categories = categoryCounts[context.label] || {
                                    device: 0,
                                    program: 0,
                                    user: 0,
                                    daily: 0,
                                };
                                return [
                                    total,
                                    `🖥️ Device: ${categories.device}`,
                                    `📂 Program: ${categories.program}`,
                                    `👤 User: ${categories.user}`,
                                    `📅 Daily: ${categories.daily}`,
                                ];
                            },
                        },
                    },
                },
            ],
        };
    } else if (activeFilter === "Monthly") {
        const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        const categoryCounts = {};
        const dailyColors = [];

        for (let i = 1; i <= daysInMonth; i++) {
            const day = adjustTimezone(new Date(date.getFullYear(), date.getMonth(), i));
            const dayKey = day.toISOString().split("T")[0];
            labels.push(dayKey);
            categoryCounts[dayKey] = { device: 0, program: 0, user: 0, daily: 0 };

            const dayOfWeek = day.getDay();
            dailyColors.push(getColorForDay(dayOfWeek, isDarkMode));
        }

        jobs.forEach((job) => {
            const jobDate = adjustTimezone(new Date(job.createdAt)).toISOString().split("T")[0];
            if (categoryCounts[jobDate]) {
                const category = job.category?.toLowerCase();
                const isSelected = selectedCategories[category?.charAt(0).toUpperCase() + category?.slice(1)];
                const processTime = parseProcessTime(job.processTime);

                if (isSelected && categoryCounts[jobDate][category] !== undefined) {
                    categoryCounts[jobDate][category] += processTime;
                    categoryData[category].totalHours += processTime;
                    categoryData[category].taskCount += 1;
                }
            }
        });

        taskCounts.push(
            ...labels.map(
                (dayKey) =>
                    (selectedCategories.Device ? categoryCounts[dayKey].device : 0) +
                    (selectedCategories.Program ? categoryCounts[dayKey].program : 0) +
                    (selectedCategories.User ? categoryCounts[dayKey].user : 0) +
                    (selectedCategories.Daily ? categoryCounts[dayKey].daily : 0)
            )
        );

        chartData = {
            labels,
            datasets: [
                {
                    label: "Total Tasks",
                    data: taskCounts,
                    backgroundColor: dailyColors, // ใช้ dailyColors ที่กำหนดสำหรับแต่ละวัน
                    hoverBackgroundColor: "#2563eb", // กำหนดสีเมื่อ hover
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                const total = `📊 Total: ${context.raw}`;
                                const categories = categoryCounts[context.label] || {
                                    device: 0,
                                    program: 0,
                                    user: 0,
                                    daily: 0,
                                };
                                return [
                                    total,
                                    `🖥️ Device: ${categories.device}`,
                                    `📂 Program: ${categories.program}`,
                                    `👤 User: ${categories.user}`,
                                    `📅 Daily: ${categories.daily}`,
                                ];
                            },
                        },
                    },
                },
            ],
        };
    } else if (activeFilter === "Weekly" || activeFilter === "Daily") {
        const days = activeFilter === "Weekly"
            ? Array.from({ length: 7 }, (_, i) => {
                const pastDate = new Date(date);
                pastDate.setDate(pastDate.getDate() - (6 - i));
                return pastDate.toISOString().split("T")[0];
            })
            : [new Date(date).toISOString().split("T")[0]];

        labels.push(...days);

        // เตรียม categoryData ให้รองรับข้อมูลตาม days
        const categoryCounts = days.reduce((acc, day) => {
            acc[day] = { device: 0, program: 0, user: 0, daily: 0 };
            return acc;
        }, {});

        jobs.forEach((job) => {
            const jobDate = new Date(job.createdAt).toISOString().split("T")[0];
            if (categoryCounts[jobDate]) {
                const category = job.category?.toLowerCase();
                const isSelected = selectedCategories[category?.charAt(0).toUpperCase() + category?.slice(1)];
                const processTime = parseProcessTime(job.processTime);

                if (isSelected && categoryCounts[jobDate][category] !== undefined) {
                    categoryCounts[jobDate][category] += processTime;
                    categoryData[category].totalHours += processTime;
                    categoryData[category].taskCount += 1;
                }
            }
        });

        chartData = {
            labels,
            datasets: Object.keys(categoryData).map((key) => ({
                label: key.charAt(0).toUpperCase() + key.slice(1),
                data: labels.map((label) => categoryCounts[label]?.[key] || 0),
                backgroundColor: getColorForCategory(key, isDarkMode),
                hoverBackgroundColor: "#2563eb",
            })),
        };
    }


    const processedData = Object.entries(categoryData).reduce((acc, [category, data]) => {
        acc[category.charAt(0).toUpperCase() + category.slice(1)] = {
            totalHours: data.totalHours,
            taskCount: data.taskCount,
        };
        return acc;
    }, {});

    return { chartData, categoryData: processedData };
};


const parseProcessTime = (processTime) => {
    if (!processTime || typeof processTime !== "string") {
        console.warn("Invalid processingTime:", processTime);
        return 0; // คืนค่า 0 หากไม่มีค่า
    }
    let hours = 0;
    let minutes = 0;

    if (processTime.includes("ชั่วโมง")) {
        const hourMatch = processTime.match(/(\d+)\s*ชั่วโมง/);
        if (hourMatch) {
            hours += parseInt(hourMatch[1], 10);
        }
    }

    if (processTime.includes("นาที")) {
        const minuteMatch = processTime.match(/(\d+)\s*นาที/);
        if (minuteMatch) {
            minutes += parseInt(minuteMatch[1], 10);
        }
    }

    return hours + minutes / 60;
};

export const chartOptionsTime = (isDarkMode) => ({
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
        title: {
            display: false,
            color: isDarkMode ? "#e2e8f0" : "#1a202c", // เพิ่มสีหัวข้อกราฟ
        },
        legend: {
            display: true,
            position: "top",
            labels: {
                color: isDarkMode ? "#e2e8f0" : "#1a202c",
            },
        },
        tooltip: {
            enabled: true,
            bodyColor: isDarkMode ? "#e2e8f0" : "#1a202c",
            titleColor: isDarkMode ? "#e2e8f0" : "#1a202c",
            backgroundColor: isDarkMode ? "#374151" : "#ffffff",
            borderColor: isDarkMode ? "#4B5563" : "#E5E7EB", // เพิ่มสีขอบ
            borderWidth: 1,
        },
        datalabels: {
            display: false, // ปิดการแสดงตัวเลขบนกราฟ
        },
        annotation: {
            annotations: {
                noData: {
                    type: "label",
                    content: "ไม่มีข้อมูลสำหรับแสดงผล",
                    color: isDarkMode ? "#e2e8f0" : "#1a202c",
                    position: "center",
                    font: {
                        size: 16,
                    },
                },
            },
        },
    },
    backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF", // เพิ่มสีพื้นหลังของกราฟ
    animation: {
        duration: 500, // ระยะเวลา animation 500ms
        easing: "easeInOutQuart", // สไตล์ของ animation
    },
    scales: {
        x: {
            type: "category",
            ticks: {
                color: isDarkMode ? "#e2e8f0" : "#1a202c", // สีข้อความแกน X
            },
            grid: {
                drawBorder: true, // ปิดเส้นขอบแกน X
                display: true, // ปิดการแสดงเส้น grid แกน X
                color: isDarkMode ? "#4a5568" : "#d1d5db", // สีเส้น grid แกน X
            },
        },
        y: {
            beginAtZero: true,
            ticks: {
                color: isDarkMode ? "#e2e8f0" : "#1a202c", // สีข้อความแกน Y
                stepSize: 5,
            },
            grid: {
                drawBorder: false, // ปิดเส้นขอบแกน X
                display: false, // ปิดการแสดงเส้น grid แกน X
                color: isDarkMode ? "#4a5568" : "#d1d5db", // สีเส้น grid แกน Y
            },
        },
    },
});




const getColorForDay = (dayOfWeek, isDarkMode) => {
    // กำหนดสีตามวันในสัปดาห์
    const colorMap = {
        0: "#ef4444",  // วันอาทิตย์ สีแดง
        1: "#f59e0b",  // วันจันทร์ สีเหลือง
        2: "#f472b6",  // วันอังคาร สีชมพู
        3: "#10b981",  // วันพุธ สีเขียว
        4: "#f97316",  // วันพฤหัส ส้ม
        5: "#3b82f6",  // วันศุกร์ สีฟ้า
        6: "#9333ea",  // วันเสาร์ สีม่วง
    };

    // หากธีมเป็น Dark Mode ให้เลือกสีจาก darkColors
    if (isDarkMode) {
        return colorMap[dayOfWeek] || "#6b7280";  // สีมาตรฐานหากไม่ได้เลือก
    } else {
        return colorMap[dayOfWeek] || "#6b7280";  // สีตามโหมด Light
    }
};


const getColorForCategory = (category, isDarkMode) => {
    const lightColors = {
        device: "#1E40AF",  // ฟ้าเข้มสำหรับ Light Mode
        program: "#059669", // เขียวสดสำหรับ Light Mode
        user: "#D97706",    // เหลืองสดสำหรับ Light Mode
        daily: "#EF4444",   // แดงสดสำหรับ Light Mode
    };

    const darkColors = {
        device: "#3B82F6",  // ฟ้าอ่อนสำหรับ Dark Mode
        program: "#10B981", // เขียวอ่อนสำหรับ Dark Mode
        user: "#F59E0B",    // เหลืองอ่อนสำหรับ Dark Mode
        daily: "#F87171",   // แดงอ่อนสำหรับ Dark Mode
    };

    // เลือกสีตามธีมที่กำหนด
    return isDarkMode
        ? (darkColors[category] || "#6B7280") // สีสำหรับ Dark Mode
        : (lightColors[category] || "#6B7280"); // สีสำหรับ Light Mode
};