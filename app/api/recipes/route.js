import connectDB from "@/server/connectDB.mjs";
import Recipe from "@/server/models/Recipe.mjs";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route.js";



export async function POST(req){
    try {
        const session = await getServerSession({req, authOptions});
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        
        await connectDB();
        const {name, author, story, ingredients, instructions, profilePic, Public, comments} = await req.json();
        const newRecipe = new Recipe({name, author, story, ingredients, instructions, profilePic, Public, comments});
        await newRecipe.save();
        return NextResponse.json({message: 'Recipe created successfully'}, {status: 201});
    } catch (error) {
        console.error('Error creating recipe:', error);
        return NextResponse.json({error: 'Error creating recipe'}, {status: 500});
    }
}

export async function GET(req) {
    try {
        await connectDB();
        const recipes = await Recipe.find({Public: true});
        return NextResponse.json(recipes, {status: 200});
    } catch (error) {
        console.error('Error fetching recipes:', error);
        return NextResponse.json({error: 'Error fetching recipes'}, {status: 500});
    }
}