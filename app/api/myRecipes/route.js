import { NextResponse } from 'next/server';
import connectDB from '@/server/connectDB.mjs';
import Recipe from '@/server/models/Recipe.mjs';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route.js';

export async function GET(req) {
  try {
    await connectDB();

    const session = await getServerSession({ req, authOptions });
    if (!session) {
    return NextResponse.json({ error: 'Unauthorized: Please log in and try again' }, { status: 401 });
    }

    const recipes = await Recipe.find({ author: session.user.name });

    if(!recipes || recipes.length === 0) {
        return NextResponse.json({error: 'No User created recipes found'}, {status: 404});
    }
    return NextResponse.json({ recipes, message : "Recipes Fetched" }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user recipes:', error);
    return NextResponse.json({ error: 'Error fetching user recipes' }, { status: 500 });
  }
}