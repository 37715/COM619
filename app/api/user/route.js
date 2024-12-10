import connectDB from "@/server/connectDB.mjs";
import User from "@/server/models/User.mjs";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route.js";
import UserRecipes from "@/server/models/UserRecipes.mjs";
import UserLikes from "@/server/models/UserLikes.mjs";
import { getToken} from "next-auth/jwt";
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

export async function PATCH(req) {
    try {
        
        const session = await getServerSession({ req, authOptions });
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { newUsername } = await req.json();

       
        if (!newUsername || newUsername === "") {
            return NextResponse.json({ error: "New username is required" }, { status: 400 });
        }

        await connectDB(); 

        const existingUser = await User.findOne({ username: newUsername });
        if (existingUser) {
            return NextResponse.json({ error: "Username already taken" }, { status: 400 });
        }

        
        const user = await User.findOneAndUpdate(
            { username: session.user.name },
            { username: newUsername },
            { new: true }
        );

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        
        const updatedUserRecipes = await UserRecipes.updateMany(
            { author: session.user.name }, 
            { $set: { author: newUsername } } 
        );

        
        const updatedUserLikes = await UserLikes.updateMany(
            { username : session.user.name }, 
            { $set: { username : newUsername } } 
        );       

        
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        token.name = newUsername;
        

        return NextResponse.json(
            {
                message: "Username updated successfully",
                username: user.username,
                updatedUserRecipes: updatedUserRecipes.modifiedCount, 
                updatedUserLikes: updatedUserLikes.modifiedCount, 
            },
            { status: 200 }
        );
    } catch (error) {
        console.log("Error updating username:", error);
        return NextResponse.json({ error: "Error updating username" }, { status: 500 });
    }
}