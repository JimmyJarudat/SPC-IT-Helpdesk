import dbConnect from "@lib/dbConnect";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"; // ใช้ bcrypt ในการเข้ารหัสรหัสผ่าน

export async function POST(req) {
    try {
        await dbConnect();

        // ดึงข้อมูลจาก body ของ request
        const { userId, newPassword, ...updateData } = await req.json(); // คาดว่ามี userId และข้อมูลที่ต้องการอัปเดต

        // ตรวจสอบว่า userId ถูกส่งมาหรือไม่
        if (!userId) {
            return NextResponse.json({
                success: false,
                message: "จำเป็นต้องมี user ID เพื่ออัปเดต",
            }, { status: 400 });
        }

        // ค้นหาผู้ใช้ตาม userId
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "ไม่พบผู้ใช้ที่ต้องการอัปเดต",
            }, { status: 404 });
        }

        // กรณีรีเซ็ตรหัสผ่าน
        if (newPassword) {
            // แฮชรหัสผ่านใหม่
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword; // อัปเดตฟิลด์รหัสผ่าน

            // ไม่ต้องอัปเดตข้อมูลอื่น ๆ ในกรณีที่มีการรีเซ็ตรหัสผ่าน
            const updatedUser = await user.save(); // บันทึกผู้ใช้ที่อัปเดต

            return NextResponse.json({
                success: true,
                data: updatedUser,
                message: "Password reset successfully",
            });
        }

        // กรณีอัปเดตข้อมูลอื่น ๆ (เช่น ชื่อ, อีเมล)
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

        // ส่งข้อมูลผู้ใช้ที่อัปเดตสำเร็จกลับไป
        return NextResponse.json({
            success: true,
            data: updatedUser,
        });

    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการอัปเดตผู้ใช้:", error.message);
        return NextResponse.json({ success: false, message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" }, { status: 500 });
    }
}

// ส่วนที่เป็น API สำหรับ DELETE
export async function DELETE(req) {
    try {
        await dbConnect();

        // ดึงข้อมูล userId จาก body
        const { userId } = await req.json();

        // ตรวจสอบว่า userId มีหรือไม่
        if (!userId) {
            return NextResponse.json({
                success: false,
                message: "ต้องการ userId เพื่อทำการลบ",
            }, { status: 400 });
        }

        // ค้นหาผู้ใช้จาก userId
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "ไม่พบผู้ใช้ที่ต้องการลบ",
            }, { status: 404 });
        }

        await User.findByIdAndDelete(userId);

        // ส่งข้อมูลสำเร็จ
        return NextResponse.json({
            success: true,
            message: "ผู้ใช้ถูกลบเรียบร้อย",
        });

    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการลบผู้ใช้:", error.message);
        return NextResponse.json({
            success: false,
            message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
        }, { status: 500 });
    }
}
 
export async function PUT(req) {
    try {
        await dbConnect();

        const {
            username,
            password,
            fullName,
            email,
            role = 'user',
            role_status = 'pending',
            company,
            department,
            employeeID,
            nickName,
            phone,
            computerName,
            position,
            division,
            location
        } = await req.json();

        // Validate required fields
        if (!username || !password ) {
            return NextResponse.json({
                success: false,
                message: "กรุณากรอกข้อมูลที่จำเป็น (username, password, email)",
            }, { status: 400 });
        }

        // Check if username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return NextResponse.json({
                success: false,
                message: "Username นี้ถูกใช้งานแล้ว",
            }, { status: 400 });
        }

        // Check if email already exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return NextResponse.json({
                success: false,
                message: "Email นี้ถูกใช้งานแล้ว",
            }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await User.create({
            username,
            password: hashedPassword,
            fullName,
            email,
            role,
            role_status,
            company,
            department,
            employeeID,
            nickName,
            phone,
            computerName,
            position,
            division,
            location,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        // Remove password from response
        const userResponse = newUser.toObject();
        delete userResponse.password;

        return NextResponse.json({
            success: true,
            message: "สร้างผู้ใช้สำเร็จ",
            data: userResponse
        }, { status: 201 });

    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการสร้างผู้ใช้:", error.message);
        return NextResponse.json({
            success: false,
            message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
        }, { status: 500 });
    }
}
