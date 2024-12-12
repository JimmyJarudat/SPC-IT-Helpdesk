import dbConnect from "@lib/dbConnect";
import ITJob from "@/models/ITJob";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");

        let filter = {};
        if (startDate && endDate) {
            const startOfDay = new Date(startDate); // startDate เป็น UTC อยู่แล้ว
            const endOfDay = new Date(endDate); // endDate เป็น UTC อยู่แล้ว
            filter.createdAt = { $gte: startOfDay, $lte: endOfDay };
        }

        const jobs = await ITJob.find(filter).sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: jobs,
        });
    } catch (error) {
        console.error("Error fetching tasks:", error.message);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
