import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import dbConnect from '../../../../../lib/dbConnect';
import User from '../../../../models/User';

export async function POST(req) {
    try {
        // รับข้อมูลจาก Body ของ Request
        const {
            fullName,
            username,
            password,
            confirmPassword,
            email,
            employeeID,
            company,
            department,
            nickName,
            phone,
            profileImage,
            computerName,
            division,
            position,
            location,
        } = await req.json();

        // ตรวจสอบว่ารหัสผ่านและการยืนยันรหัสผ่านตรงกัน
        if (password !== confirmPassword) {
            return NextResponse.json(
                { error: 'Passwords do not match' },
                { status: 400 }
            );
        }

        await dbConnect();

        // ตรวจสอบว่า username หรือ email หรือ employeeID มีอยู่ในระบบหรือไม่
        const existingUser = await User.findOne({
            $or: [{ username }, { email }, { employeeID }],
        });
        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this username, email, or employee ID already exists' },
                { status: 409 }
            );
        }

        // แฮชรหัสผ่านก่อนบันทึกในฐานข้อมูล
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            fullName: fullName || null,
            username,
            password: hashedPassword,
            email: email || null,
            employeeID: employeeID || null,
            company: company || null,
            department: department || null,
            nickName: nickName || null,
            phone: phone || null,
            profileImage: profileImage || null,
            computerName: computerName || null,
            division: division || null,
            position: position || null,
            location: location || null,
            role: 'user',
            role_status: 'pending',
          });
          
          // บันทึกผู้ใช้ลงในฐานข้อมูล
          await newUser.save();
          

        // ส่ง Response กลับไปพร้อมข้อมูลผู้ใช้ใหม่
        return NextResponse.json(
            { message: 'User created successfully', user: newUser },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error:', error.message);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
