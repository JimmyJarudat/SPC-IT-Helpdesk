import dbConnect from "@lib/dbConnect";
import ITJob from "@/models/ITJob";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        // เชื่อมต่อฐานข้อมูล
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");

        if (!startDate || !endDate) {
            return NextResponse.json(
                { success: false, message: "Start date and end date are required." },
                { status: 400 }
            );
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        const filter = {
            createdAt: {
                $gte: start,
                $lte: end,
            },
        };

        const jobs = await ITJob.find(filter).sort({ createdAt: -1 });

        if (jobs.length === 0) {
            return NextResponse.json(
                { success: false, message: "No jobs found for the selected date range." },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: jobs }, { status: 200 });
    } catch (error) {
        console.error("Error exporting jobs:", error);
        return NextResponse.json(
            { success: false, message: "An error occurred while exporting jobs.", error: error.message },
            { status: 500 }
        );
    }
}
