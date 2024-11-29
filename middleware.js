import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export default function middleware(req) {
  const token = req.cookies.get('authToken'); // ดึง Cookie `authToken`
  const url = req.nextUrl.clone();

  // ป้องกันการเข้าถึง path ที่เริ่มต้นด้วย `/dashboard`
  if (url.pathname.startsWith('/dashboard')) {
    if (!token) {
      // ถ้าไม่มี Token ให้ redirect ไปที่หน้า Home
      url.pathname = '/';
      return NextResponse.redirect(url);
    }

    try {
      jwt.verify(token, JWT_SECRET); // ตรวจสอบว่า Token ถูกต้อง
    } catch (error) {
      // ถ้า Token ไม่ถูกต้อง redirect ไปหน้า Home
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next(); // อนุญาตให้ผ่าน
}

export const config = {
  matcher: ['/dashboard/:path*'], // ระบุ path ที่ต้องการให้ Middleware ตรวจสอบ
};
