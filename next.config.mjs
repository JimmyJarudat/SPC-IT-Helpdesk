/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['picsum.photos'], // เพิ่มโดเมนของภาพที่อนุญาต
    },
    api: {
        bodyParser: false,
      },
};

export default nextConfig;
