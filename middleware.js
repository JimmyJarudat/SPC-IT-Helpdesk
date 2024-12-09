import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export default function middleware(req) {
  const token = req.cookies.get("authToken"); // อ่าน Token จาก Cookies
  const url = req.nextUrl.clone();

  //console.log("Token from Middleware:", token); // Debug Token

  if (url.pathname.startsWith("/overview")) {
    if (!token) {
      //console.log("No token found. Redirecting to /login...");
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET); // Verify JWT
      //console.log("Decoded Token from Middleware:", decoded); // Debug User Data
    } catch (error) {
      //console.error("Invalid token. Redirecting to /login...", error.message);
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next(); // อนุญาตให้ผ่าน
}

export const config = {
  matcher: ["/overview/:path*"], // ใช้ Middleware กับ path ที่ระบุ
};
