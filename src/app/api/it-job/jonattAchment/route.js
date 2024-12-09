import { writeFile } from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const mongoURI = 'YOUR_MONGODB_CONNECTION_STRING'; // ใส่ MongoDB URI
const client = new MongoClient(mongoURI);

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('jobImage'); // รับไฟล์รูปจากฟอร์ม
    const jobNumber = formData.get('jobNumber'); // รับเลขที่งานจากฟอร์ม
    const jobDetails = formData.get('jobDetails'); // รับรายละเอียดงานจากฟอร์ม

    if (!file || !jobNumber) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // สร้าง path สำหรับเก็บไฟล์
    const uploadDir = path.join(process.cwd(), 'public/uploads/job-images');
    const filePath = path.join(uploadDir, `${jobNumber}${path.extname(file.name)}`); // ใช้เลขที่งานเป็นชื่อไฟล์

    // สร้างโฟลเดอร์ถ้าจำเป็น
    await import('fs').then((fs) => {
      fs.mkdirSync(uploadDir, { recursive: true });
    });

    // บันทึกไฟล์ไปยังพาธที่กำหนด
    await writeFile(filePath, buffer);

    // สร้างพาธสำหรับบันทึกในฐานข้อมูล
    const dbFilePath = `/uploads/job-images/${jobNumber}${path.extname(file.name)}`;

    // บันทึกข้อมูลลง MongoDB
    await client.connect();
    const db = client.db('it-helpdesk'); // ชื่อฐานข้อมูล
    const jobsCollection = db.collection('jobs'); // ชื่อคอลเลกชัน

    const result = await jobsCollection.insertOne({
      jobNumber,
      jobDetails,
      imagePath: dbFilePath,
      createdAt: new Date(),
    });

    return NextResponse.json({
      message: 'Job created and image uploaded successfully',
      jobId: result.insertedId,
      filePath: dbFilePath,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: 'Failed to create job' }, { status: 500 });
  } finally {
    await client.close(); // ปิดการเชื่อมต่อกับ MongoDB
  }
}

export const config = {
  api: {
    bodyParser: false, // ปิดการใช้ bodyParser สำหรับการจัดการไฟล์
  },
};
