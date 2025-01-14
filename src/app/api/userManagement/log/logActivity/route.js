// route.js
import dbConnect from "@lib/dbConnect";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await dbConnect();
        
        const body = await req.json();
        const { userId, activity, logType } = body;

        if (!userId || !activity) {
            return NextResponse.json({ 
                success: false, 
                message: "กรุณาระบุ userId และ activity" 
            }, { status: 400 });
        }

        // กำหนด field ที่จะบันทึกตาม logType
        let logField;
        switch(logType) {
            case 'SOS':
                logField = 'activityLogSOS';
                break;
            case 'PAGE_VIEW':
                logField = 'activityLogPage';
                break;
            default:
                logField = 'activityLogAPI';
        }

        // เพิ่ม IP address เข้าไปใน ipAddressUser array
        if (activity.ipAddress) {
            await User.findByIdAndUpdate(
                userId,
                {
                    $addToSet: { // ใช้ $addToSet แทน $push เพื่อป้องกันการซ้ำ
                        ipAddressUser: activity.ipAddress
                    }
                }
            );
        }

        // อัพเดทข้อมูล user
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