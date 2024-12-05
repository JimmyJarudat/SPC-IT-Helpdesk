import { NextResponse } from "next/server";
import dbConnect from "@lib/dbConnect";
import ITJob from "@/models/ITJob"; 



export async function POST(req) {
    try {
      await dbConnect();
  
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));
  
      const existingJobs = await ITJob.find({
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      });
  
      const dailyTasks = [
        { name: "Backup ข้อมูลรายวัน" },
        { name: "จัดเก็บไฟล์เสียง" },
        { name: "ตรวจสอบกล้องวงจรปิด" },
        { name: "อัพเดทฐานข้อมูล Power Bi" },
      ];
  
      const existingJobNames = existingJobs.map((job) => job.jobName);
  
      // งานที่ยังไม่ได้เปิด
      const tasksToCreate = dailyTasks.filter(
        (task) => !existingJobNames.includes(task.name)
      );
  
      return NextResponse.json({
        success: true,
        tasksToCreate,
        existingJobs,
      });
    } catch (error) {
      console.error("Error processing daily tasks:", error.message);
      return NextResponse.json(
        { success: false, message: "Internal server error" },
        { status: 500 }
      );
    }
  }