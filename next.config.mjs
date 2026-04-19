/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '3000',
                pathname: '/api/profile/getImage/**',
            },
        ],
        domains: ['picsum.photos'],
    },
    // ลบ api: { bodyParser: false } ออก — ไม่รองรับใน App Router
};

export default nextConfig;