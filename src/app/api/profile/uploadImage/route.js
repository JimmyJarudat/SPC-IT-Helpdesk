import { writeFile } from 'fs/promises';
import fs from 'fs'; // Import fs สำหรับการทำงานกับไฟล์
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('profileImage');
    const username = formData.get('username'); // รับชื่อผู้ใช้จาก FormData

    // ตรวจสอบสิทธิ์ผู้ใช้ (คุณสามารถเพิ่มการตรวจสอบ Token หรือ Session ที่นี่)
    const authorized = true; // เปลี่ยนเงื่อนไขนี้ตามระบบของคุณ
    if (!authorized) {
      return NextResponse.json({ message: 'Unauthorized access' }, { status: 403 });
    }

    if (!file) {
      return NextResponse.json({ message: 'No file received' }, { status: 400 });
    }

    if (!username) {
      return NextResponse.json({ message: 'No username received' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // สร้าง path สำหรับเก็บไฟล์ที่ใช้ชื่อผู้ใช้เป็นชื่อไฟล์
    const uploadDir = path.join(process.cwd(), 'files', 'profile-images');
    const filePath = path.join(uploadDir, `${username}${path.extname(file.name)}`);

    // สร้างโฟลเดอร์หากไม่มี
    await fs.promises.mkdir(uploadDir, { recursive: true });
    
    // ตรวจสอบว่ามีไฟล์เก่าหรือไม่
    if (fs.existsSync(filePath)) {
      // ถ้ามีไฟล์เก่าให้ลบก่อน
      await fs.promises.unlink(filePath);
    }

    // เขียนไฟล์ใหม่ไปยังที่เก็บ
    await fs.promises.writeFile(filePath, buffer);

    return NextResponse.json({
      message: 'Image uploaded successfully',
      filePath: `/api/profile/getImage/${username}${path.extname(file.name)}`,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ message: 'Upload failed' }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false,  // ปิดการใช้ bodyParser สำหรับการจัดการไฟล์
  },
};
