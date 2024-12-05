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

        let filter = {};

        if (startDate && endDate) {
            filter.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };

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
        const sort = searchParams.get("sort") || "asc"; // รับค่าการจัดเรียง
        const sortOption = sort === "asc" ? 1 : -1;

     

        const skip = (page - 1) * limit; // คำนวณ skip ที่ถูกต้อง
        const jobs = await ITJob.find(filter)
        .sort({ jobID: sortOption })
            .skip(skip).
            limit(limit)
            .sort({ createdAt: -1 });

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
