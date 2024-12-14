
export const processChartData = (jobs, activeFilter, date, isDarkMode, adjustTimezone) => {
    const labels = [];
    const taskCounts = [];
    let chartData = { labels: [], datasets: [] };

    if (activeFilter === "Yearly") {
        const months = Array.from({ length: 12 }, (_, i) =>
            new Date(date.getFullYear(), i, 1).toLocaleString("default", { month: "long" })
        );
        const categoryCounts = months.reduce((acc, month) => {
            acc[month] = { device: 0, program: 0, user: 0, daily: 0 };
            return acc;
        }, {});
    
        // เก็บจำนวนงานในแต่ละประเภท
        jobs.forEach((job) => {
            const jobDate = new Date(job.createdAt);
            const month = jobDate.toLocaleString("default", { month: "long" });
            if (categoryCounts[month]) {
                const category = job.category?.toLowerCase();
                if (categoryCounts[month][category] !== undefined) {
                    categoryCounts[month][category]++;
                }
            }
        });
    
        const labels = Object.keys(categoryCounts);
        const taskCounts = labels.map(
            (month) =>
                categoryCounts[month].device +
                categoryCounts[month].program +
                categoryCounts[month].user +
                categoryCounts[month].daily
        );
    
        const monthColors = [
            "#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#9333EA", "#06B6D4",
            "#EA580C", "#4ADE80", "#A855F7", "#22D3EE", "#F43F5E", "#D97706"
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
    }
    


    else if (activeFilter === "Monthly") {
        const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        const categoryCounts = {}; // เก็บข้อมูลแยกตามประเภท
        const dailyColors = []; // เก็บสีแต่ละวัน

        // เตรียม labels สำหรับแต่ละวัน
        for (let i = 1; i <= daysInMonth; i++) {
            const day = adjustTimezone(new Date(date.getFullYear(), date.getMonth(), i));
            const dayKey = day.toISOString().split("T")[0];
            labels.push(dayKey);
            categoryCounts[dayKey] = { device: 0, program: 0, user: 0, daily: 0 }; // เริ่มต้นค่า 0 สำหรับทุกประเภท

            // ใช้ getDay() เพื่อเลือกสีตามวันในสัปดาห์
            const dayOfWeek = day.getDay(); // รับค่า 0-6 สำหรับวันอาทิตย์ถึงวันเสาร์
            dailyColors.push(getColorForDay(dayOfWeek, isDarkMode)); // ใช้ getColorForDay เพื่อเลือกสีที่แตกต่างกันตามวัน
        }

        // เก็บจำนวนงานในแต่ละประเภท
        jobs.forEach((job) => {
            const jobDate = adjustTimezone(new Date(job.createdAt)).toISOString().split("T")[0];
            if (categoryCounts[jobDate]) {
                const category = job.category?.toLowerCase();
                if (categoryCounts[jobDate][category] !== undefined) {
                    categoryCounts[jobDate][category]++;
                }
            }
        });

        // รวมจำนวนงานทั้งหมดของแต่ละวัน
        labels.forEach((label) => {
            const totalTasks =
                categoryCounts[label].device +
                categoryCounts[label].program +
                categoryCounts[label].user +
                categoryCounts[label].daily;
            taskCounts.push(totalTasks);
        });

        chartData={
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
      
    }

    else if (activeFilter === "Weekly" || activeFilter === "Daily") {
        const categoryData = {
            device: [],
            program: [],
            user: [],
            daily: [],
            pm: [],
        };

        const days = activeFilter === "Daily" ? [new Date(date).toISOString().split("T")[0]] : Array.from({ length: 7 }, (_, i) => {
            const day = new Date(date);
            day.setDate(date.getDate() - (6 - i));
            return day.toISOString().split("T")[0];
        });

        days.forEach((day) => {
            labels.push(day);
            Object.keys(categoryData).forEach((key) => {
                categoryData[key].push(0);
            });
        });

        jobs.forEach((job) => {
            const jobDate = new Date(job.createdAt).toISOString().split("T")[0];
            const index = labels.indexOf(jobDate);
            if (index !== -1 && job.category) {
                const category = job.category.toLowerCase();
                if (categoryData[category] !== undefined) {
                    categoryData[category][index]++;
                }
            }
        });

        chartData={
            labels,
            datasets: Object.keys(categoryData).map((key) => ({
                label: key.charAt(0).toUpperCase() + key.slice(1),
                data: categoryData[key],
                backgroundColor: getColorForCategory(key, isDarkMode), // ส่ง isDarkMode ไปยังฟังก์ชัน getColorForCategory
            }))

        };
       
    }

    return chartData;
};
export const chartOptions = (isDarkMode, maxValue) => ({
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
        anchor: "end", // ตำแหน่งข้อความ
        align: "end", // จัดข้อความให้อยู่ด้านบนของแท่ง
        color: isDarkMode ? "#e2e8f0" : "#1a202c", // สีข้อความ
        font: {
          size: 14,
          weight: "bold",
        },
        
        formatter: (value) => {
            return value === 0 ? "" : `${value} `;
        },
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
        suggestedMax: Math.ceil((maxValue / 0.8) / 5) * 5,
        ticks: {
          color: isDarkMode ? "#e2e8f0" : "#1a202c", // สีข้อความแกน Y
          stepSize: 5,
        },
        grid: {
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