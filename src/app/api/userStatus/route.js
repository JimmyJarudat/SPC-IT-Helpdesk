import clientPromise from "../../../../lib/mongodb";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";  // เพิ่มการ import ObjectId

export async function GET(req) {
    try {
        console.log("API /api/userStatus called");

        // ตรวจสอบ Authorization Header
        const authHeader = req.headers.get("authorization"); // ใช้ lowercase
        console.log("Authorization Header:", authHeader);

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.log("Unauthorized: Missing or invalid Authorization header");
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }

        // แยก JWT Token
        const token = authHeader.split(" ")[1];
        console.log("Received Token:", token);

        // ตรวจสอบ Token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Decoded Token:", decoded);
        } catch (error) {
            console.log("JWT verification failed:", error);
            return new Response(JSON.stringify({ error: "Invalid or expired token" }), { status: 401 });
        }

        // ตรวจสอบว่า process.env.JWT_SECRET มีค่า
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not defined");
            return new Response(JSON.stringify({ error: "Server configuration error" }), { status: 500 });
        }

        const client = await clientPromise;
        const db = client.db("it-helpdesk");

        // ค้นหาข้อมูลผู้ใช้ในฐานข้อมูล โดยแปลง id เป็น ObjectId
        const user = await db.collection("users").findOne({ _id: new ObjectId(decoded.id) });
        
        if (!user) {
            console.log("User not found in database");
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
        }

        console.log("User found:", user);

        // ส่งสถานะ role_status กลับ
        return new Response(JSON.stringify({ role_status: user.role_status }), { status: 200 });
    } catch (error) {
        console.error("Error in API /api/userStatus:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}