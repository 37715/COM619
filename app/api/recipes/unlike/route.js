import { NextResponse } from 'next/server';
import connectDB from '@/server/connectDB.mjs';
import UserLikes from '@/server/models/UserLikes.mjs';
import Recipe from '@/server/models/Recipe.mjs';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route.js';

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

    const recipe = await Recipe.findOneAndUpdate(
        { name: recipeName },
      { $inc: { likes: -1 } },
      { new: true }
    );

    if (!recipe) {
        return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Like removed successfully', recipe }, { status: 200 });
    } catch (error) {
    console.error('Error removing like:', error);
    return NextResponse.json({ error: 'Error removing like' }, { status: 500 });
    }
}