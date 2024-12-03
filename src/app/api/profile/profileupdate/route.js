import { NextResponse } from "next/server";
import dbConnect from "../../../../../lib/dbConnect";
import User from "../../../../models/User";

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET; // JWT Secret จาก .env.local

// GET Method: ดึงข้อมูลโปรไฟล์
export async function GET(req) {
  try {
    // เชื่อมต่อฐานข้อมูล
    await dbConnect();

    // ดึง Token จากคุกกี้
    const cookieString = req.headers.get("cookie") || "";
    const token = cookieString
      .split("; ")
      .find((row) => row.startsWith("authToken="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ถอดรหัส Token
    const decoded = jwt.verify(token, JWT_SECRET);
    const username = decoded.username;

    // ค้นหาผู้ใช้จากฐานข้อมูล
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    user.password = undefined; // ไม่ส่งคืนฟิลด์ password
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching profile:", error.message);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// PUT Method: อัปเดตข้อมูลโปรไฟล์
export async function PUT(req) {
  try {
    // เชื่อมต่อฐานข้อมูล
    await dbConnect();

    // ดึง Token จากคุกกี้
    const cookieString = req.headers.get("cookie") || "";
    const token = cookieString
      .split("; ")
      .find((row) => row.startsWith("authToken="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ถอดรหัส Token
    const decoded = jwt.verify(token, JWT_SECRET);
    const username = decoded.username;

    // รับข้อมูลใหม่จาก body
    const body = await req.json();

    // อัปเดตข้อมูลในฐานข้อมูล
    const updatedUser = await User.findOneAndUpdate(
      { username },
      { $set: body },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Error updating profile:", error.message);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
