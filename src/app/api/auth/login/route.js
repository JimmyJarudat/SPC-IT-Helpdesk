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
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const now = new Date();
    if (user.failedLoginAttempts >= 3 && now - user.lastFailedLogin < 5 * 60 * 1000) {
      return NextResponse.json({ message: 'กรุณาลองใหม่ใน 5 นาที' }, { status: 400 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      user.failedLoginAttempts = user.failedLoginAttempts + 1;
      user.lastFailedLogin = now;
      await user.save();
      return NextResponse.json({ message: 'รหัสผ่านไม่ถูกต้อง' }, { status: 400 });
    }

    user.failedLoginAttempts = 0;
    user.lastLogin = now;
    user.online = true;
    user.lastActivityTime = now;
    await user.save();

    user.password = undefined;
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
      isFirstLogin: user.isFirstLogin,
    }, JWT_SECRET, { expiresIn: '7d' });

    const response = NextResponse.json({
      message: 'Login successful',
      user,
      token,
    });

    response.cookies.set('authToken', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('Error:', error.message);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}