import { Client } from 'ssh2';


/**
 * @swagger
 * /api/kpi:
 *   get:
 *     summary: ดึงข้อมูล NAS Configurations
 *     description: API สำหรับเชื่อมต่อกับ NAS และดึงข้อมูลพื้นที่ใช้งาน
 *     parameters:
 *       - in: query
 *         name: ip
 *         schema:
 *           type: string
 *           example: "192.168.2.83"
 *         required: false
 *         description: IP Address ของ NAS (ถ้าไม่ได้ระบุ จะดึงข้อมูลทั้งหมด)
 *       - in: query
 *         name: port
 *         schema:
 *           type: integer
 *           example: 8778
 *         required: false
 *         description: พอร์ตของ NAS
 *     responses:
 *       200:
 *         description: ดึงข้อมูลสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ip:
 *                   type: string
 *                   description: IP Address ของ NAS
 *                   example: "192.168.2.83"
 *                 totalCommand:
 *                   type: string
 *                   description: คำสั่งที่ใช้ดึงข้อมูลพื้นที่รวม
 *                   example: "df -B1"
 *                 currentCommand:
 *                   type: string
 *                   description: คำสั่งที่ใช้ดึงข้อมูลพื้นที่ใช้งาน
 *                   example: "df -B1 /share/CACHEDEV1_DATA"
 *                 totalSummary:
 *                   type: object
 *                   description: สรุปข้อมูลพื้นที่ใช้งานทั้งหมด
 *                   properties:
 *                     totalSize:
 *                       type: string
 *                       description: ขนาดรวมของพื้นที่เก็บข้อมูล
 *                       example: "1TB"
 *                     totalUsed:
 *                       type: string
 *                       description: พื้นที่ที่ใช้งานแล้ว
 *                       example: "500GB"
 *                     totalFree:
 *                       type: string
 *                       description: พื้นที่ที่เหลือ
 *                       example: "500GB"
 *       500:
 *         description: เกิดข้อผิดพลาดในระบบ
 */




const NAS_CONFIGS = [
    { 
        ip: '192.168.2.83', 
        port: 8778, 
        totalCommand: 'df -B1', 
        currentCommand: 'df -B1 /share/CACHEDEV1_DATA' 
    },
    
    { 
        ip: '192.168.2.82', 
        port: 22, 
        totalCommand: 'df -k',
        currentCommand: 'df -k /share/CACHEDEV1_DATA'
    },
];

export async function GET(req) {
    const results = await Promise.all(
        NAS_CONFIGS.map(({ ip, port, totalCommand, currentCommand }) => fetchNASData(ip, port, totalCommand, currentCommand))
    );

    return new Response(JSON.stringify(results), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}

async function fetchNASData(ip, port, totalCommand, currentCommand) {
    const conn = new Client();
    const sshConfig = {
        host: ip,
        port,
        username: 'Test',
        password: '',
    };

    let totalOutput = '';
    let currentOutput = '';

    const unit = totalCommand.includes('-B1') ? 'B' : 'KB'; // ตรวจสอบคำสั่งเพื่อตั้งหน่วย

    return new Promise((resolve) => {
        conn.on('ready', () => {
            conn.exec(totalCommand, (err, stream1) => {
                if (err) {
                    conn.end();
                    return resolve({ ip, port, error: `Failed to execute command (total): ${err.message}` });
                }

                stream1.on('close', () => {
                    conn.exec(currentCommand, (err, stream2) => {
                        if (err) {
                            conn.end();
                            return resolve({ ip, port, error: `Failed to execute command (current): ${err.message}` });
                        }

                        stream2
                            .on('close', () => {
                                conn.end();
                                try {
                                    const totalData = ip === '192.168.2.82'
                                        ? processTotalOutput82(totalOutput)
                                        : processTotalOutput(totalOutput, unit);

                                    const currentData = ip === '192.168.2.82'
                                        ? processSSHOutput82(currentOutput)
                                        : processSSHOutput(currentOutput);

                                    resolve({
                                        ip,
                                        port,
                                        totalSummary: totalData.summary,
                                        totalDetails: totalData.details,
                                        currentSummary: currentData.summary,
                                        currentDetails: currentData.details,
                                    });
                                } catch (error) {
                                    console.error(`Error processing data for ${ip}:${port}`, error);
                                    resolve({ ip, port, error: 'Error processing data.' });
                                }
                            })
                            .on('data', (data) => {
                                currentOutput += data.toString();
                            })
                            .stderr.on('data', (data) => {
                                console.error(`SSH Error (current) for ${ip}:${port}:`, data.toString());
                            });
                    });
                }).on('data', (data) => {
                    totalOutput += data.toString();
                }).stderr.on('data', (data) => {
                    console.error(`SSH Error (total) for ${ip}:${port}:`, data.toString());
                });
            });
        }).on('error', (err) => {
            console.error(`Connection error for ${ip}:${port}:`, err);
            resolve({ ip, port, error: 'Connection failed.' });
        }).connect(sshConfig);
    });
}

function processTotalOutput(output, unit = 'KB') {
    console.log('Raw Total Output:', output); // Debug Output

    // ค้นหาบรรทัดที่เกี่ยวข้องกับ /share/CACHEDEV1_DATA
    const lines = output.split('\n').filter((line) => line.includes('/share/CACHEDEV1_DATA'));
    const totalSummary = { totalSize: 0, totalUsed: 0, totalFree: 0 };

    const multiplier = unit === 'B' ? 1 : 1024; // Byte หรือ KB
    lines.forEach((line) => {
        const [filesystem, size, used, available, usePercent] = line.split(/\s+/);
        if (!size || !used || !available) return; // ข้ามบรรทัดที่ไม่มีข้อมูลครบถ้วน

        const sizeBytes = parseInt(size, 10) * multiplier;
        const usedBytes = parseInt(used, 10) * multiplier;
        const availableBytes = parseInt(available, 10) * multiplier;

        totalSummary.totalSize += sizeBytes;
        totalSummary.totalUsed += usedBytes;
        totalSummary.totalFree += availableBytes;
    });

    console.log('Processed Total Summary:', totalSummary);

    // คำนวณเปอร์เซ็นต์ของ Used และ Free
    const usedPercent = totalSummary.totalSize
        ? ((totalSummary.totalUsed / totalSummary.totalSize) * 100).toFixed(2) + '%'
        : '0%';
    const freePercent = totalSummary.totalSize
        ? ((totalSummary.totalFree / totalSummary.totalSize) * 100).toFixed(2) + '%'
        : '0%';

    return {
        summary: {
            totalSize: formatBytes(totalSummary.totalSize),
            totalUsed: `${formatBytes(totalSummary.totalUsed)} (${usedPercent})`,
            totalFree: `${formatBytes(totalSummary.totalFree)} (${freePercent})`,
            usagePercent: totalSummary.totalSize
                ? ((totalSummary.totalUsed / totalSummary.totalSize) * 100).toFixed(2) + '%'
                : '0%',
        },
        details: [],
    };
}


function processSSHOutput(output) {
    const lines = output.split('\n');
    const paths = ['/share/CACHEDEV1_DATA'];
    let poolInfo;

    for (const path of paths) {
        poolInfo = lines.find((line) => line.includes(path));
        if (poolInfo) break;
    }

    if (!poolInfo) throw new Error('Storage Pool data not found.');

    const [filesystem, size, used, available, usePercent, mounted] = poolInfo.split(/\s+/);

    return {
        summary: {
            totalSize: formatBytes(parseSize(size)),
            totalFree: formatBytes(parseSize(available)),
            usagePercent: usePercent,
            freePercent: ((parseSize(available) / parseSize(size)) * 100).toFixed(2) + '%',
        },
        details: [
            {
                filesystem,
                size: formatBytes(parseSize(size)),
                used: formatBytes(parseSize(used)),
                available: formatBytes(parseSize(available)),
                usePercent,
                mounted,
            },
        ],
    };
}

function processTotalOutput82(output) {
    console.log('Raw Output:', output); // Debug raw output

    // ค้นหาบรรทัดที่มีข้อมูลของ /share/CACHEDEV1_DATA
    const line = output.split('\n').find((line) => line.includes('/share/CACHEDEV1_DATA'));
    if (!line) {
        console.error('No matching line found for /share/CACHEDEV1_DATA');
        return {
            summary: {
                totalSize: '0 TB',
                totalUsed: '0 TB',
                totalFree: '0 TB',
                usagePercent: '0%',
            },
        };
    }

    console.log('Matched Line:', line); // Debug matched line

    // แยกข้อมูลจากบรรทัด
    const columns = line.split(/\s+/);
    if (columns.length < 6) {
        console.error('Insufficient data in matched line:', line);
        return {
            summary: {
                totalSize: '0 TB',
                totalUsed: '0 TB',
                totalFree: '0 TB',
                usagePercent: '0%',
            },
        };
    }

    const size = parseInt(columns[1], 10) || 0; // ขนาดทั้งหมดใน 1k-blocks
    const used = parseInt(columns[2], 10) || 0; // ขนาดที่ใช้ไปใน 1k-blocks
    const available = parseInt(columns[3], 10) || 0; // ขนาดที่เหลือใน 1k-blocks

    // แปลงจาก 1k-blocks → TB
    const sizeTB = size / (1024 ** 2); // จาก 1k-blocks เป็น TB
    const usedTB = used / (1024 ** 2);
    const availableTB = available / (1024 ** 2);

    // คำนวณ Usage Percent
    const usagePercent = sizeTB
        ? ((usedTB / sizeTB) * 100).toFixed(2) + '%'
        : '0%';

    console.log('Parsed Values:', { sizeTB, usedTB, availableTB, usagePercent }); // Debug

    // Return ผลลัพธ์
    return {
        summary: {
            totalSize: sizeTB.toFixed(2) + ' TB',
            totalUsed: usedTB.toFixed(2) + ' TB',
            totalFree: availableTB.toFixed(2) + ' TB',
            usagePercent,
        },
    };
}


function processSSHOutput82(output) {
    console.log('Raw Current Output:', output); // Debug Log

    // แบ่งข้อมูลออกเป็นบรรทัด
    const lines = output.split('\n');
    const poolInfo = lines.find((line) => line.includes('/share/CACHEDEV1_DATA'));

    if (!poolInfo) {
        console.error('No matching line found for /share/CACHEDEV1_DATA');
        return {
            summary: {
                totalSize: '0 TB',
                totalUsed: '0 TB',
                totalFree: '0 TB',
                usagePercent: '0%',
            },
        };
    }

    console.log('Pool Info:', poolInfo); // Debug Pool Info

    // ใช้ Regular Expression เพื่อจับค่าข้อมูล
    const match = poolInfo.match(/(\S+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+%)\s+(\S+)/);
    if (!match) {
        console.error('Failed to parse poolInfo:', poolInfo);
        return {
            summary: {
                totalSize: '0 TB',
                totalUsed: '0 TB',
                totalFree: '0 TB',
                usagePercent: '0%',
            },
        };
    }

    // ดึงค่าจาก Regular Expression
    const [, filesystem, size, used, available, usePercent, mounted] = match;

    // แปลงค่าจาก 1k-blocks เป็น TB
    const sizeTB = parseInt(size, 10) / (1024 ** 2); // จาก 1k-blocks เป็น TB
    const usedTB = parseInt(used, 10) / (1024 ** 2); // จาก 1k-blocks เป็น TB
    const availableTB = parseInt(available, 10) / (1024 ** 2); // จาก 1k-blocks เป็น TB

    console.log('Parsed Values:', { sizeTB, usedTB, availableTB, usePercent }); // Debug ค่าที่แปลงได้

    // คำนวณ Usage Percent
    const calculatedUsagePercent = ((usedTB / sizeTB) * 100).toFixed(2) + '%';

    // Return ข้อมูลในรูปแบบ JSON
    return {
        summary: {
            totalSize: sizeTB.toFixed(2) + ' TB',
            totalUsed: usedTB.toFixed(2) + ' TB',
            totalFree: availableTB.toFixed(2) + ' TB',
            usagePercent: calculatedUsagePercent,
        },
    };
}















function formatBytes(bytes) {
    const TB = 1024 ** 4;
    const GB = 1024 ** 3;

    if (bytes >= TB) {
        return (bytes / TB).toFixed(2) + ' TB';
    } else if (bytes >= GB) {
        return (bytes / GB).toFixed(2) + ' GB';
    } else {
        return (bytes / (1024 ** 2)).toFixed(2) + ' MB'; // Default to MB
    }
}





function parseSize(sizeStr) {
    const unit = sizeStr.slice(-1); // ดึงตัวอักษรสุดท้าย (หน่วย)
    const size = parseFloat(sizeStr); // แปลงตัวเลข

    switch (unit) {
        case 'T': return size * 1024 ** 4; // Terabytes
        case 'G': return size * 1024 ** 3; // Gigabytes
        case 'M': return size * 1024 ** 2; // Megabytes
        default: return size; // ไม่มีหน่วย ให้ถือว่าเป็น Bytes
    }
}
