import { NextResponse } from 'next/server';
import connectDB from '@/server/connectDB.mjs';
import Recipe from '@/server/models/Recipe.mjs';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route.js';


export async function GET(req, { params }) {
  try {
    await connectDB();

    const { name } =  await params;

    if (!name) {
      return NextResponse.json({ error: 'Recipe name is required' }, { status: 400 });
    }

    const recipe = await Recipe.findOne({ name });

    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    return NextResponse.json({ comments: recipe.comments }, { status: 200 });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Error fetching comments' }, { status: 500 });
  }
}


export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const session = await getServerSession({ req, authOptions });
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized: Please log in and try again' }, { status: 401 });
    }

    const { name } = await params;
    const { comment } = await req.json();

    if (!name || !comment) {
      console.log(name, comment);
      return NextResponse.json({ error: 'Recipe name and comment are required' }, { status: 400 });
    }

    const recipe = await Recipe.findOneAndUpdate(
      { name },
      { $push: { comments: { userName: session.user.name, comment: comment} } },
      { new: true }
    );

    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Comment added successfully', recipe }, { status: 200 });
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json({ error: 'Error adding comment' }, { status: 500 });
  }
}


export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const session = await getServerSession({ req, authOptions });
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized: Please log in and try again' }, { status: 401 });
    }

    const { name, commentId } = params;

    if (!name || !commentId) {
      return NextResponse.json({ error: 'Recipe name and comment ID are required' }, { status: 400 });
    }

    const recipe = await Recipe.findOneAndUpdate(
      { name },
      { $pull: { comments: { _id: commentId, username: session.user.name } } },
      { new: true }
    );

    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Comment deleted successfully', recipe }, { status: 200 });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json({ error: 'Error deleting comment' }, { status: 500 });
  }
}