import { NextResponse } from "next/server";
import dbConnect from "@lib/dbConnect";
import ITJob from "@/models/ITJob"; 

export async function GET(req) {
    try {
        // เชื่อมต่อฐานข้อมูล
        await dbConnect();
        console.log("Database connected");

        // ค้นหางานที่มี status = "pending"
        const pendingJobs = await ITJob.find({ status: "pending" });
        console.log("Pending jobs:", pendingJobs);

        
        if (!pendingJobs.length) {
            console.log("No pending jobs found");
            return NextResponse.json({ success: true, data: [] }, { status: 200 });
        }
        
        
        

        // ส่งข้อมูลกลับ
        return NextResponse.json({ success: true, data: pendingJobs }, { status: 200 });
    } catch (error) {
        console.error("Error fetching jobs:", error.message);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        await dbConnect(); // เชื่อมต่อฐานข้อมูล
        console.log("Database connected");

        // รับข้อมูลจาก Body
        const { jobID, jobOwner, updateFields } = await req.json();
        console.log("Job update payload:", { jobID, jobOwner, updateFields });

        // ตรวจสอบว่า jobID มีหรือไม่
        if (!jobID) {
            return NextResponse.json(
                { success: false, message: "jobID is required" },
                { status: 400 }
            );
        }

        // แปลง progress เป็นตัวเลข
        if (updateFields.progress) {
            updateFields.progress = parseFloat(updateFields.progress.replace("%", ""));
        }

        // ค้นหาและอัปเดตข้อมูล
        const updatedJob = await ITJob.findOneAndUpdate(
            { jobID },
            {
                $set: {
                    ...updateFields,
                    nameJob_owner: jobOwner.name || "",
                    nicknameJob_owner: jobOwner.nickname || "",
                    emailJob_owner: jobOwner.email || "",
                    phoneJob_owner: jobOwner.phone || "",
                    dateAcepJob_owner: new Date(),
                    status: "pending", // อัปเดตสถานะเป็น 'in_progress'
                },
            },
            { new: true } // คืนค่าข้อมูลที่อัปเดต
        );

        // ตรวจสอบว่าพบข้อมูลหรือไม่
        if (!updatedJob) {
            return NextResponse.json(
                { success: false, message: "Job not found" },
                { status: 404 }
            );
        }

        // ส่งผลลัพธ์กลับ
        console.log("Job updated successfully:", updatedJob);
        return NextResponse.json(
            { success: true, data: updatedJob },
            { status: 200 }
        );
    } catch (error) {
        // จัดการข้อผิดพลาด
        console.error("Error updating job:", error.message);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}

