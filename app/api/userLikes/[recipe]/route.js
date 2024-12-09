import { NextResponse } from 'next/server';
import connectDB from '@/server/connectDB.mjs';
import UserLikes from '@/server/models/UserLikes.mjs';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route.js';

export async function GET(req, { params }) {
  try {
    await connectDB();

    const session = await getServerSession({ req, authOptions });
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized: Please log in and try again' }, { status: 401 });
    }
    
    const { recipe } = await params;  
    console.log(recipe);
    console.log(session.user.name);

    if (!recipe) {
        return NextResponse.json({ error: 'Recipe name is required' }, { status: 400 });
    }

    const like = await UserLikes.findOne({ username: session.user.name, recipeName: recipe });

    if (!like || like.length === 0) {
        return new NextResponse(null, { status: 204 });
    } else {
        return NextResponse.json({ like, message: "You have already Liked this Recipe!" }, { status: 200 });
    }
  } catch (error) {
    console.error('Error fetching like:', error);
    return NextResponse.json({ error: 'Error fetching like' }, { status: 500 });
  }
}