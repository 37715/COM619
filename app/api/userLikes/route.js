import { NextResponse } from 'next/server';
import connectDB from '@/server/connectDB.mjs';
import UserLikes from '@/server/models/UserLikes.mjs';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route.js';


export async function GET(req) {
  try {
    await connectDB();

    const session = await getServerSession({ req, authOptions });
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized: Please log in and try again' }, { status: 401 });
    }

    const likes = await UserLikes.find({ username: session.user.name });

    return NextResponse.json({ likes }, { status: 200 });
  } catch (error) {
    console.error('Error fetching likes:', error);
    return NextResponse.json({ error: 'Error fetching likes' }, { status: 500 });
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

    const existingLike = await UserLikes.findOne({ username: session.user.name, recipeName });
    if (existingLike) {
      return NextResponse.json({ error: 'You have already liked this recipe' }, { status: 400 });
    }

    const newLike = new UserLikes({ username: session.user.name, recipeName });
    await newLike.save();

    return NextResponse.json({ message: 'Recipe liked successfully', newLike }, { status: 201 });
  } catch (error) {
    console.error('Error liking recipe:', error);
    return NextResponse.json({ error: 'Error liking recipe' }, { status: 500 });
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

    const like = await UserLikes.findOneAndDelete({ username: session.user.name, recipeName });

    if (!like) {
      return NextResponse.json({ error: 'Like not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Like removed successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error removing like:', error);
    return NextResponse.json({ error: 'Error removing like' }, { status: 500 });
  }
}