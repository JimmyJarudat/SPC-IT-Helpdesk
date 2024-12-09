import { writeFile } from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('profileImage');
    const username = formData.get('username'); // รับชื่อผู้ใช้จาก FormData

    if (!file) {
      return NextResponse.json({ message: 'No file received' }, { status: 400 });
    }

    if (!username) {
      return NextResponse.json({ message: 'No username received' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // สร้าง path สำหรับเก็บไฟล์ที่ใช้ชื่อผู้ใช้เป็นชื่อไฟล์
    const uploadDir = path.join(process.cwd(), 'public/uploads/profile-images');
    const filePath = path.join(uploadDir, `${username}${path.extname(file.name)}`); // ใช้ชื่อผู้ใช้และนามสกุลไฟล์

    // สร้างโฟลเดอร์ถ้าจำเป็น
    await import('fs').then((fs) => {
      fs.mkdirSync(uploadDir, { recursive: true });
    });

    // ทับไฟล์เดิมถ้ามี
    await writeFile(filePath, buffer);

    return NextResponse.json({
      message: 'Image uploaded successfully',
      filePath: `/uploads/profile-images/${username}${path.extname(file.name)}`,
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
