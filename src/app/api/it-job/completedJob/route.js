import { NextResponse } from "next/server";
import dbConnect from "@lib/dbConnect";
import ITJob from "@/models/ITJob";
import { useUser } from "@/contexts/UserContext";

export async function GET(req) {
    try {
        await dbConnect(); // เชื่อมต่อฐานข้อมูล
        console.log("Database connected");

        const { searchParams } = new URL(req.url);

        // รับค่า Query Parameters
        const fullName = searchParams.get("fullName");
        const page = parseInt(searchParams.get("page")) || 1; // หน้าปัจจุบัน (default: 1)
        const limit = parseInt(searchParams.get("limit")) || 50; // จำนวนข้อมูลต่อหน้า (default: 10)

        if (!fullName) {
            console.error("FullName is missing in the request");
            return NextResponse.json(
                { success: false, message: "User fullName is required" },
                { status: 400 }
            );
        }

        console.log(`Fetching jobs for fullName: ${fullName}, Page: ${page}, Limit: ${limit}`);

        // คำนวณ offset สำหรับดึงข้อมูล
        const skip = (page - 1) * limit;

        // ดึงข้อมูลงานที่ตรงตามเงื่อนไข
        const completedJobs = await ITJob.find({
            status: { $in: ["completed", "completed_Late"] },
            nameJob_owner: fullName,
        })
            .skip(skip) // ข้ามข้อมูลตาม offset
            .limit(limit) // ดึงข้อมูลตามจำนวนที่กำหนด
            .sort({ updatedAt: -1 }); // เรียงลำดับจากล่าสุดไปเก่าสุด

        // นับจำนวนเอกสารทั้งหมด
        const totalJobs = await ITJob.countDocuments({
            status: { $in: ["completed", "completed_Late"] },
            nameJob_owner: fullName,
        });

        console.log("Completed jobs fetched:", completedJobs);

        return NextResponse.json(
            {
                success: true,
                data: completedJobs,
                pagination: {
                    total: totalJobs,
                    page,
                    limit,
                    totalPages: Math.ceil(totalJobs / limit),
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching completed jobs:", error.message);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}



