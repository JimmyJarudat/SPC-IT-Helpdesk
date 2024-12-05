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

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

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
