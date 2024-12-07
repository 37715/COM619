import connectDB from "@/server/connectDB.mjs";
import User from "@/server/models/User.mjs";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route.js";

export async function GET(req) {
    try {

        const session = await getServerSession({req, authOptions});

        if (!session) {
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }

        await connectDB();

        const user = await User.findOne({username : session.user.name});

        if (!user) {
            return NextResponse.json({error: "User not found"}, {status: 404});
        }
        return NextResponse.json({
            username : user.username,
            isAdmin: user.isAdmin
        }
            , {status: 200});
    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json({error: 'Error fetching user'}, {status: 500});
    }
}