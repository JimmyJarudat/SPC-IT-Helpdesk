import dbConnect from "@lib/dbConnect";
import ITJob from "@/models/ITJob";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 20;
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");
        const category = searchParams.get("category");
        const status = searchParams.get("status");

       
        let filter = {};

        if (startDate && endDate) {
            const startOfDay = new Date(`${startDate}T00:00:00.000Z`);
            const endOfDay = new Date(`${endDate}T23:59:59.999Z`);
            filter.createdAt = { $gte: startOfDay, $lte: endOfDay };


        } else {
            const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
            const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
            filter.createdAt = { $gte: startOfMonth, $lt: endOfMonth };
        }

        const search = searchParams.get("search") || ""; // รับค่าคำค้นหาจาก query

        if (search) {
            filter.$or = [
                { jobName: { $regex: search, $options: "i" } }, // ค้นหาใน `jobName`
                { jobID: { $regex: search, $options: "i" } },   // ค้นหาใน `jobID`
                { nickName: { $regex: search, $options: "i" } },
            ];
        }

        if (category) {
            filter.category = category; // เพิ่มตัวกรองหมวดหมู่
        }
        if (status) {
            filter.status = status; // เพิ่มตัวกรองสถานะ
        }

        
        const sortField = searchParams.get("sortField") || "createdAt"; // ค่า default เป็น createdAt
        const sortOrder = searchParams.get("sort") === "asc" ? 1 : -1;
        const skip = (page - 1) * limit; // คำนวณ skip ที่ถูกต้อง
        const jobs = await ITJob.find(filter)
            .sort({ [sortField]: sortOrder }) // เรียงลำดับตามฟิลด์ไดนามิก
            .skip(skip)
            .limit(limit);


        const totalFiltered = await ITJob.countDocuments(filter);
        const totalPages = Math.ceil(totalFiltered / limit);

        console.log({
            filter,
            skip,
            limit,
            page,
            totalFiltered,
            totalPages,
            jobsFetched: jobs.length,
        });

        return NextResponse.json({
            success: true,
            data: jobs,
            pagination: {
                total: totalFiltered,
                page,
                limit,
                totalPages: totalPages || 1,
            },
        });
    } catch (error) {
        console.error("Error fetching tasks:", error.message);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
