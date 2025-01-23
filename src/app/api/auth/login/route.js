import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dbConnect from '../../../../../lib/dbConnect';
import User from '../../../../models/User';

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: เข้าสู่ระบบผู้ใช้งาน
 *     description: API สำหรับตรวจสอบข้อมูลผู้ใช้งานและเข้าสู่ระบบ โดยมีการจัดการความปลอดภัย เช่น การล็อกบัญชีหากพยายามล็อกอินผิดเกิน 3 ครั้ง
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: ชื่อผู้ใช้งาน
 *                 example: "john_doe"
 *               password:
 *                 type: string
 *                 description: รหัสผ่านของผู้ใช้งาน
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: เข้าสู่ระบบสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *                 user:
 *                   type: object
 *                   description: ข้อมูลผู้ใช้งาน (ไม่รวมรหัสผ่าน)
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: รหัสผู้ใช้งาน
 *                       example: "64a7c24e5f2b1d3e6fdb1c13"
 *                     username:
 *                       type: string
 *                       description: ชื่อผู้ใช้งาน
 *                       example: "john_doe"
 *                     fullName:
 *                       type: string
 *                       description: ชื่อเต็มของผู้ใช้งาน
 *                       example: "John Doe"
 *                 token:
 *                   type: string
 *                   description: JWT Token ที่ใช้สำหรับการยืนยันตัวตน
 *                   example: "eyJhbGciOiJIUzI1NiIsInR..."
 *       401:
 *         description: รหัสผ่านไม่ถูกต้อง
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "รหัสผ่านไม่ถูกต้อง"
 *                 remainingAttempts:
 *                   type: integer
 *                   description: จำนวนครั้งที่เหลือก่อนบัญชีถูกล็อก
 *                   example: 2
 *       403:
 *         description: บัญชีถูกล็อก
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "บัญชีของคุณถูกล็อก กรุณาลองใหม่อีกครั้งใน 15 นาที"
 *       404:
 *         description: ไม่พบชื่อผู้ใช้งาน
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "ไม่พบชื่อผู้ใช้งานในระบบ"
 *       500:
 *         description: เกิดข้อผิดพลาดในระบบ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */



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
<<<<<<< Updated upstream
      isFirstLogin: user.isFirstLogin,

=======
>>>>>>> Stashed changes
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
