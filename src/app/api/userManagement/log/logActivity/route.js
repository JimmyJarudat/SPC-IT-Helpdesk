// route.js
import dbConnect from "@lib/dbConnect";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await dbConnect();
        
        const body = await req.json();
        const { userId, activity } = body;

        if (!userId || !activity) {
            return NextResponse.json({ 
                success: false, 
                message: "กรุณาระบุ userId และ activity" 
            }, { status: 400 });
        }

        // กำหนดว่าจะบันทึกลงใน field ไหนตาม method
        const logField = activity.method === 'PAGE_VIEW' ? 'activityLogPage' : 'activityLogAPI';

        // อัพเดทข้อมูล user โดยเพิ่ม activity ใหม่และเก็บแค่ 20 รายการล่าสุด
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $push: {
                    [logField]: {
                        $each: [activity],
                        $slice: -20  // เก็บแค่ 20 รายการล่าสุด
                    }
                }
            },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ 
                success: false, 
                message: "ไม่พบผู้ใช้งาน" 
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: updatedUser[logField]
        });

    } catch (error) {
        console.error("Error saving activity log:", error.message);
        return NextResponse.json({ 
            success: false, 
            message: "Internal server error" 
        }, { status: 500 });
    }
}