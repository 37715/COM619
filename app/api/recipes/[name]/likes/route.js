import { NextResponse } from 'next/server';
import connectDB from '@/server/connectDB.mjs';
import Recipe from '@/server/models/Recipe.mjs';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route.js"; 



export async function PATCH(req, { params }) {
  try { 
    await connectDB();   

    const session = await getServerSession({req, authOptions});
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized: Please log in an try again' }, { status: 401 });
    }

    const { name } = await params;

    if (!name) {
      return NextResponse.json({ error: 'Recipe name is required' }, { status: 400 });
    }

    
    const recipe = await Recipe.findOneAndUpdate(
      { name }, 
      { $inc: { likes: 1 } }, 
      { new: true } 
    );

    
    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    
    return NextResponse.json(
      { message: 'Likes updated successfully',
        data:{
          recipe,
        } 
       },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating likes:', error);
    return NextResponse.json({ error: 'Error updating likes' }, { status: 500 });
  }
}
