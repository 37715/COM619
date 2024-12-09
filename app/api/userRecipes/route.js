import { NextResponse } from 'next/server';
import connectDB from '@/server/connectDB.mjs';
import UserRecipes from '@/server/models/UserRecipes.mjs';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route.js';


export async function GET(req) {
  try {
    await connectDB();

    const session = await getServerSession({ req, authOptions });
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized: Please log in and try again' }, { status: 401 });
    }
    console.log(session.user.name);
    const recipes = await UserRecipes.find({ username: session.user.name });

    return NextResponse.json({ recipes, username: session.user.name }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user recipes:', error);
    return NextResponse.json({ error: 'Error fetching user recipes' }, { status: 500 });
  }
}


export async function POST(req) {
  try {
    await connectDB();

    const session = await getServerSession({ req, authOptions });
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized: Please log in and try again' }, { status: 401 });
    }

    const { recipeName } = await req.json();

    if (!recipeName) {
      return NextResponse.json({ error: 'Recipe name is required' }, { status: 400 });
    }

    const newRecipe = new UserRecipes({ username: session.user.name, recipeName });
    await newRecipe.save();

    return NextResponse.json({ message: 'Recipe added successfully', newRecipe }, { status: 201 });
  } catch (error) {
    console.error('Error adding recipe:', error);
    return NextResponse.json({ error: 'Error adding recipe' }, { status: 500 });
  }
}


export async function DELETE(req) {
  try {
    await connectDB();

    const session = await getServerSession({ req, authOptions });
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized: Please log in and try again' }, { status: 401 });
    }

    const { recipeName } = await req.json();

    if (!recipeName) {
      return NextResponse.json({ error: 'Recipe name is required' }, { status: 400 });
    }

    const recipe = await UserRecipes.findOneAndDelete({ username: session.user.name, recipeName });

    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Recipe removed successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error removing recipe:', error);
    return NextResponse.json({ error: 'Error removing recipe' }, { status: 500 });
  }
}