import { NextResponse } from "next/server";
import dbConnect from "../../../../../lib/dbConnect";
import User from "../../../../models/User";

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

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
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      console.error("Invalid token:", error);
      return NextResponse.json({ message: "Invalid token" }, { status: 403 });
    }

    const username = decoded.username;

    // รับข้อมูลใหม่จาก body
    let body;
    try {
      body = await req.json();
    } catch (error) {
      console.error("Invalid request body:", error);
      return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
    }

    const { currentPassword, newPassword, ...otherUpdates } = body;

    // ค้นหาผู้ใช้จากฐานข้อมูล
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // กรณีเปลี่ยนรหัสผ่าน
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return NextResponse.json({ message: "Current password is incorrect" }, { status: 403 });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword; // อัปเดตฟิลด์รหัสผ่าน
      console.log("Password updated in memory"); // Debug ตรวจสอบว่าอัปเดตสำเร็จ
    }

    // อัปเดตข้อมูลอื่นๆ (เช่น ชื่อ, อีเมล)
    if (Object.keys(otherUpdates).length > 0) {
      Object.assign(user, otherUpdates);
    }

    // อัปเดตสถานะการล็อกอินครั้งแรก
    user.isFirstLogin = false;

    // บันทึกข้อมูลในฐานข้อมูล
    const savedUser = await user.save();
    console.log("Saved user:", savedUser); // Debug ดูข้อมูลที่บันทึกสำเร็จ




    return NextResponse.json({ message: "Profile updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating profile:", error);

    // ส่งข้อความแสดงข้อผิดพลาดที่มีรายละเอียดเพิ่มเติมในโหมดพัฒนา
    const isDev = process.env.NODE_ENV === "development"; // ตรวจสอบว่าอยู่ในโหมดพัฒนา
    const message = isDev ? error.message : "Internal server error";

    return NextResponse.json({ message }, { status: 500 });
  }

}

// GET Method: ดึงข้อมูลผู้ใช้ตามเบอร์โทรศัพท์
export async function POST(req) {
  try {
    await dbConnect();
    console.log("Database connected");

    const { phone } = await req.json();
    console.log("Phone received:", phone);

    if (!phone) {
      return NextResponse.json({ message: "Phone number is required" }, { status: 400 });
    }

    // ค้นหาผู้ใช้ทั้งหมดที่มีเบอร์โทรนี้
    const users = await User.find({ phone });
    console.log("Users found:", users);

    if (users.length === 0) {
      return NextResponse.json({ message: "No users found for this phone number" }, { status: 404 });
    }

    // ส่งข้อมูลผู้ใช้ทั้งหมดกลับไป
    return NextResponse.json({
      success: true,
      data: users.map((user) => ({
        company: user.company,
        location: user.location,
        email: user.email,
        computerName: user.computerName,
        fullName: user.fullName,
        nickName: user.nickName,
        position: user.position,
        department: user.department,
        division: user.division,
      })),
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching users by phone:", error.message);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}



