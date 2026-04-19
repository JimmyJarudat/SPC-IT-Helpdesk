# SPC IT Helpdesk

ระบบ IT Helpdesk สำหรับแจ้งปัญหาและติดตามงานของแผนก IT

## Tech Stack
- **Frontend**: Next.js 15, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: MongoDB (Docker Swarm)
- **Auth**: JWT, bcrypt
- **Deploy**: Vercel

## Features
- ระบบ Login/Signup พร้อมล็อกบัญชีเมื่อกรอกรหัสผิด 3 ครั้ง
- แจ้งปัญหา IT และติดตามสถานะ ticket
- Dashboard สรุปงาน
- จัดการผู้ใช้และสิทธิ์การเข้าถึง
- รองรับ 2 ภาษา (ไทย/อังกฤษ)

## Getting Started
```bash
bun install
bun dev
```

## Environment Variables
```env
MONGO_URI=
JWT_SECRET=
```
