import { NextResponse } from "next/server";
import dbConnect from "@lib/dbConnect";
import ITJob from "@/models/ITJob";

export async function GET(req) {
    try {
        // เชื่อมต่อกับฐานข้อมูล
        await dbConnect();
        console.log("Database connected");

        const fullName = req.nextUrl.searchParams.get("fullName");

        if (!fullName) {
            return NextResponse.json(
                { success: false, message: "Missing fullName parameter" },
                { status: 400 }
            );
        }

        // ดึงข้อมูลงานที่มีสถานะ in_progress
        const inProgressJobs = await ITJob.find({
            status: "in_progress",
            nameJob_owner: fullName
        });

        // ตรวจสอบว่าพบงานหรือไม่
        if (inProgressJobs.length === 0) {
            return NextResponse.json(
                { success: true, message: "No jobs in progress", data: [] },
                { status: 200 }
            );
        }

        // ส่งข้อมูลงานที่พบกลับไป
        return NextResponse.json(
            { success: true, data: inProgressJobs },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching in-progress jobs:", error.message);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
