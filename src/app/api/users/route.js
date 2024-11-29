import clientPromise from "../../../../lib/mongodb";

export async function GET(req) {
    try {
        const client = await clientPromise;
        const db = client.db("it-helpdesk"); // ใช้ฐานข้อมูลใหม่
        const users = await db.collection("user").find({}).toArray();

        return new Response(JSON.stringify(users), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}
