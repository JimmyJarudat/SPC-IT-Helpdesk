import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dbConnect from '../../../../../lib/dbConnect';
import User from '../../../../models/User';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    const { username, password } = await req.json();
    await dbConnect();

    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // ตรวจสอบการพยายามเข้าสู่ระบบผิดพลาด
    const now = new Date();
    if (user.failedLoginAttempts >= 3 && now - user.lastFailedLogin < 5 * 60 * 1000) {
      // หากมีการพยายามผิดพลาดเกิน 3 ครั้งและยังไม่ครบ 5 นาที
      return NextResponse.json({ message: 'กรุณาลองใหม่ใน 5 นาที' }, { status: 400 }); // แจ้ง UI ว่าให้รอ
    }

    // ตรวจสอบรหัสผ่าน
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // อัปเดตจำนวนครั้งที่พยายามเข้าสู่ระบบผิดพลาด
      user.failedLoginAttempts = user.failedLoginAttempts + 1;
      user.lastFailedLogin = now;
      await user.save(); // บันทึกการพยายามผิดพลาด

      return NextResponse.json({ message: 'รหัสผ่านไม่ถูกต้อง' }, { status: 400 }); // แจ้ง UI ว่ารหัสผิด
    }

    // รีเซ็ตการพยายามผิดพลาดหากล็อกอินสำเร็จ
    user.failedLoginAttempts = 0;

    // อัปเดตเวลาล็อกอินล่าสุด
    user.lastLogin = now;
    user.online = true;
    user.lastActivityTime = now; // อัปเดตเวลาล่าสุดที่ผู้ใช้ทำกิจกรรม
    await user.save();

    user.password = undefined; // ลบฟิลด์ password ออกจาก Response
    const token = jwt.sign({
      id: user._id,
      fullName: user.fullName,
      username: user.username,
      role: user.role,
      role_status: user.role_status,
      company: user.company,
      department: user.department,
      email: user.email,
      employeeID: user.employeeID,
      nickName: user.nickName,
      phone: user.phone,
      computerName: user.computerName,
      division: user.division,
      position: user.position,
      location: user.location,
      profileImage: user.profileImage,

    }, JWT_SECRET, { expiresIn: '7d' }); // Token มีอายุ 7 วัน
    console.log("Generated Token:", token); // Debug Token

    const response = NextResponse.json({
      message: 'Login successful',
      user, // ส่งข้อมูลผู้ใช้ทั้งหมด (ยกเว้น password)
      token,
    });

    response.cookies.set('authToken', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // คุกกี้หมดอายุใน 7 วัน
    });

    return response;
  } catch (error) {
    console.error('Error:', error.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
