import { NextResponse } from "next/server";
import dbConnect from "@lib/dbConnect";
import ITJob from "@/models/ITJob"; // Import Model ITJob ที่ผูกกับ it-job

export async function POST(req) {
    try {
        // เชื่อมต่อฐานข้อมูล
        await dbConnect();
        console.log("Database connected");

        // อ่านข้อมูลจาก body
        const body = await req.json();

         // สร้าง jobID แบบอัตโนมัติ
         const currentMonth = new Date().toISOString().slice(0, 7).replace("-", ""); // ได้รูปแบบ "202411"
         const prefix = `IT${currentMonth}`;
 
         // ค้นหา jobID ล่าสุดที่เริ่มต้นด้วย prefix
         const lastJob = await ITJob.findOne({ jobID: { $regex: `^${prefix}` } })
             .sort({ jobID: -1 })
             .exec();
 
         let newJobID;
         if (lastJob) {
             // ถ้ามี jobID ที่ตรงกับ prefix แล้ว, เพิ่มเลขลำดับต่อท้าย
             const lastNumber = parseInt(lastJob.jobID.slice(-3)); // ดึงเลขท้าย 3 ตัว
             newJobID = `${prefix}${String(lastNumber + 1).padStart(3, "0")}`; // เพิ่มเลข 1 และเติม 0 ด้านหน้า
         } else {
             // ถ้ายังไม่มี jobID เริ่มต้นด้วย prefix, เริ่มต้นที่ 001
             newJobID = `${prefix}001`;
         }

        // สร้างเอกสารใหม่ใน it-job
        const newJob = new ITJob({
            jobID: newJobID, 
            createdAt: body.createdAt || new Date(),
            company: body.company || "",
            location: body.location || "",
            computerName: body.computerName || "",
            position: body.position || "",
            fullName: body.fullName || "",
            nickName: body.nickName || "",
            division: body.division || "",
            department: body.department || "",
            email: body.email || "",
            phoneNumber: body.phoneNumber,
            jobName: body.jobName,
            jobDescription: body.jobDescription || "",
            category: body.category || "",
            resolution_notes: body.resolution_notes || "",
            device_change_info: body.device_change_info || "",
            nameJob_owner: body.nameJob_owner || "", 
            nicknameJob_owner: body.nicknameJob_owner || "",
            emailJob_owner: body.emailJob_owner || "",
            phoneJob_owner: body.phoneJob_owner || "",
            dateAcepJob_owner: body.dateAcepJob_owner || "",
            status: body.status || "pending",
            processTime: body.processTime || "",
            completionDate: body.completionDate || "",
            dueDate: body.dueDate || "",
            progress: body.progress || 0
        });

        // บันทึกในฐานข้อมูล
        const savedJob = await newJob.save();

        // ส่งข้อมูลที่บันทึกกลับ
        return NextResponse.json({ success: true, data: savedJob }, { status: 201 });
    } catch (error) {
        console.error("Error saving job:", error.message);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
