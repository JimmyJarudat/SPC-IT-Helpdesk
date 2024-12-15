import dbConnect from "@lib/dbConnect";
import ITJob from "@/models/ITJob";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const fullName = searchParams.get("fullName");
        const nickName = searchParams.get("nickName"); // ดึงชื่อผู้ใช้งานจาก query
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 20;
        let startDate = searchParams.get("startDate");
        let endDate = searchParams.get("endDate");
        const category = searchParams.get("category");
        const status = searchParams.get("status");

        // ตรวจสอบว่ามี Full Name หรือไม่
        if (!fullName) {
            return NextResponse.json(
                { success: false, message: "User fullName is required" },
                { status: 400 }
            );
        }

        // ใช้ช่วงวันที่ของเดือนปัจจุบัน หากไม่มีการระบุวันที่
        if (!startDate || !endDate) {
            const now = new Date();
            startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();
        }

        

        // ปรับการเรียงลำดับ
        const sortOption = searchParams.get("sort") === "asc" ? 1 : -1;
        const sort = { createdAt: sortOption };

        // กำหนด Filters
        const filters = {
            $or: [
                { nameJob_owner: fullName }, // เงื่อนไขที่ 1: ตรงกับ fullName
                { nicknameJob_owner: nickName }, // เงื่อนไขที่ 2: ตรงกับ nickName
            ],
            status: { $in: ["completed", "completed_Late"] }, // เงื่อนไขสถานะ
            createdAt: {
                $gte: new Date(startDate), // วันที่เริ่มต้น
                $lte: new Date(endDate),   // วันที่สิ้นสุด
            },
        };
        

        
        if (searchParams.get("search")) {
            const searchQuery = searchParams.get("search");
            filters.$or = [
                { jobID: { $regex: searchQuery, $options: "i" } }, // ค้นหาใน jobID
                { jobName: { $regex: searchQuery, $options: "i" } }, // ค้นหาใน jobName
                { nickName: { $regex: searchQuery, $options: "i" } } // ค้นหาใน nameJob_owner
            ];
        }

        // เพิ่มตัวกรองหมวดหมู่
        if (category) {
            filters.category = category;
        }

        // เพิ่มตัวกรองสถานะ
        if (status) {
            filters.status = status;
        }

        // Pagination และ Sorting
        const skip = (page - 1) * limit;

        // Query ข้อมูลจาก MongoDB
        const jobs = await ITJob.find(filters).skip(skip).limit(limit).sort(sort);
        const totalJobs = await ITJob.countDocuments(filters);

        // ส่งผลลัพธ์กลับไป
        return NextResponse.json({
            success: true,
            data: jobs,
            pagination: {
                total: totalJobs,
                page,
                limit,
                totalPages: Math.ceil(totalJobs / limit),
            },
        });
    } catch (error) {
        console.error("Error fetching tasks:", error.message);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
