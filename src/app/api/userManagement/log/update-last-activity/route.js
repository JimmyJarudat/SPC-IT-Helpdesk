import { NextResponse } from 'next/server';
import dbConnect from '@lib/dbConnect';
import User from '@/models/User';
import { Types } from 'mongoose';  // สำหรับตรวจสอบ ObjectId

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    const status = url.searchParams.get('status'); // รับค่า status จาก query

    console.log('UserId:', userId, 'Status:', status);

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    if (!Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: 'Invalid User ID format' }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // อัพเดททั้ง lastActivityTime และ online status
    // เช็คสถานะการออนไลน์
    if (status === 'offline') {
      user.lastOffline = new Date();  // บันทึกเวลาที่ผู้ใช้เป็นออฟไลน์
      user.online = false; // กำหนดสถานะออนไลน์เป็น false
    } else {
      user.lastActivityTime = new Date();  // บันทึกเวลาสำหรับสถานะออนไลน์
      user.online = true;  // กำหนดสถานะออนไลน์เป็น true
    }

    await user.save();  // บันทึกข้อมูลผู้ใช้


    return NextResponse.json({
      message: 'Activity time and status updated successfully',
      lastActivityTime: user.lastActivityTime,
      isOnline: user.online,
    });
  } catch (error) {
    console.error('Error:', error.message);
    return NextResponse.json({ error: `Internal server error: ${error.message}` }, { status: 500 });
  }
}
