import clientPromise from "../../../../../lib/mongodb";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
    try {
        const { username, password } = await req.json();

        const client = await clientPromise;
        const db = client.db("it-helpdesk");

        const user = await db.collection("users").findOne({ username });

        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return new Response(
            JSON.stringify({ token, role_status: user.role_status }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in login API:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}
