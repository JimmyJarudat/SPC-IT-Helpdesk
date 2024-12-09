import { NextResponse } from "next/server";
import dbConnect from "@lib/dbConnect";
import ITJob from "@/models/ITJob";
import path from "path";
import { writeFile } from "fs/promises";

export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(req) {
    try {
        // เชื่อมต่อฐานข้อมูล
        await dbConnect();
        console.log("Database connected");

        // แปลง req เป็น FormData
        const formData = await req.formData();

        // สร้าง jobID แบบอัตโนมัติ
        const currentMonth = new Date().toISOString().slice(0, 7).replace("-", "");
        const prefix = `IT${currentMonth}`;

        // ค้นหา jobID ล่าสุด
        const lastJob = await ITJob.findOne({ jobID: { $regex: `^${prefix}` } })
            .sort({ jobID: -1 })
            .exec();

        let newJobID;
        if (lastJob) {
            const lastNumber = parseInt(lastJob.jobID.slice(-3));
            newJobID = `${prefix}${String(lastNumber + 1).padStart(3, "0")}`;
        } else {
            newJobID = `${prefix}001`;
        }

        // บันทึกรูปภาพ
        let attachment = null;
        const imageFile = formData.get("image");
        
        if (imageFile && imageFile instanceof File) {
            const uploadDir = path.join(process.cwd(), "public/uploads/job-images");
            
            // สร้าง directory หากยังไม่มี
            await import("fs").then((fs) => fs.mkdirSync(uploadDir, { recursive: true }));

            // สร้างชื่อไฟล์ที่ไม่ซ้ำกัน
            const fileExtension = imageFile.name.split('.').pop();
            const fileName = `${newJobID}.${fileExtension}`;
            const filePath = path.join(uploadDir, fileName);

            // แปลง File เป็น Buffer
            const bytes = await imageFile.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // เขียนไฟล์
            await writeFile(filePath, buffer);

            attachment = `/uploads/job-images/${fileName}`;
        }

        // เตรียมข้อมูล job จาก formData
        const jobData = {
            jobID: newJobID,
            createdAt: formData.get('createdAt') || new Date(),
            company: formData.get('company') || "",
            location: formData.get('location') || "",
            computerName: formData.get('computerName') || "",
            position: formData.get('position') || "",
            fullName: formData.get('fullName') || "",
            nickName: formData.get('nickName') || "",
            division: formData.get('division') || "",
            department: formData.get('department') || "",
            email: formData.get('email') || "",
            phoneNumber: formData.get('phoneNumber'),
            jobName: formData.get('jobName'),
            jobDescription: formData.get('jobDescription') || "",
            category: formData.get('category') || "",
            resolution_notes: formData.get('resolution_notes') || "",
            device_change_info: formData.get('device_change_info') || "",
            nameJob_owner: formData.get('nameJob_owner') || "",
            nicknameJob_owner: formData.get('nicknameJob_owner') || "",
            emailJob_owner: formData.get('emailJob_owner') || "",
            phoneJob_owner: formData.get('phoneJob_owner') || "",
            dateAcepJob_owner: formData.get('dateAcepJob_owner') || "",
            status: formData.get('status') || "pending",
            processTime: formData.get('processTime') || "",
            completionDate: formData.get('completionDate') || "",
            dueDate: formData.get('dueDate') || "",
            progress: formData.get('progress') || 0,
            tag: formData.get('tag') || "",
            attachment,
        };

        // สร้างเอกสารใหม่ใน it-job
        const newJob = new ITJob(jobData);

        // บันทึกในฐานข้อมูล
        const savedJob = await newJob.save();

        // ส่งข้อมูลที่บันทึกกลับ
        return NextResponse.json({ success: true, data: savedJob }, { status: 201 });
    } catch (error) {
        console.error("Error saving job:", error.message);
        return NextResponse.json({ 
            success: false, 
            message: "Internal server error", 
            error: error.message 
        }, { status: 500 });
    }
}