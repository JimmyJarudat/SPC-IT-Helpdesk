/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '3000',
                pathname: '/api/profile/getImage/**', // ระบุเส้นทางแบบไดนามิก
            },
        ],
        domains: ['picsum.photos'], // เพิ่มโดเมนของภาพที่อนุญาต (ถ้าจำเป็น)
    },
    api: {
        bodyParser: false, // ปิด bodyParser สำหรับ API ที่จัดการไฟล์
    },
};

export default nextConfig;

