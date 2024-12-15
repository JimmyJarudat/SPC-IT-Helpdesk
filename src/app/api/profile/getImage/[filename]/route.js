import fs from "fs";
import path from "path";

export async function GET(req, context) {
    try {
        // ใช้ await กับ context.params
        const { filename } = await context.params;

        // สร้าง path ของไฟล์
        const filePath = path.join(process.cwd(), "files", "profile-images", filename);

        // ตรวจสอบว่าไฟล์มีอยู่หรือไม่
        if (!fs.existsSync(filePath)) {
            // ใช้รูป placeholder หากไฟล์หาย
            const placeholderPath = path.join(process.cwd(), "files", "profile-images", "placeholder.png");
            const placeholder = fs.readFileSync(placeholderPath);

            return new Response(placeholder, {
                headers: {
                    "Content-Type": "image/png",
                },
            });
        }

        // อ่านไฟล์จาก filePath
        const file = fs.readFileSync(filePath);
        const ext = path.extname(filename).toLowerCase();
        const contentType = ext === ".png" ? "image/png" : "image/jpeg";

        return new Response(file, {
            headers: {
                "Content-Type": contentType,
            },
        });
    } catch (error) {
        console.error("Error fetching image:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
