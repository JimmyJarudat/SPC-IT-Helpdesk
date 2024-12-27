import dbConnect from "@lib/dbConnect";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await dbConnect();

         // ดึงข้อมูลทั้งหมดจากฐานข้อมูล
         const users = await User.find().sort({ username: 1 });  
        
         if (Array.isArray(users)) {
            return NextResponse.json({
                success: true,
                data: users,
            });
        } else {
            return NextResponse.json({
                success: false,
                message: "ข้อมูลไม่ใช่อาร์เรย์",
            });
        }
    } catch (error) {
        console.error("Error fetching tasks:", error.message);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}

