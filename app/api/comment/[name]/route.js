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

export async function POST(req, { params }) {
  try {
    await connectDB();

    const session = await getServerSession({ req, authOptions });
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized: Please log in and try again' }, { status: 401 });
    }

    const { name } = await params;
    const { comment } = await req.json();

    if (!name || !comment || comment === '' || name === '') {
      return NextResponse.json({ error: 'Recipe name and comment are required' }, { status: 400 });
    }

    const recipe = await Recipe.findOneAndUpdate(
      { name },
      { $push: { comments: { userName: session.user.name, comment: comment.trim() } } },
      { new: true }
    );

    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Comment added successfully', recipe }, { status: 200 });
  } catch (error) {
    console.log('Error adding comment:', error);
    return NextResponse.json({ error: 'Error adding comment' }, { status: 500 });
  }
};


export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const session = await getServerSession({ req, authOptions });
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized: Please log in and try again' }, { status: 401 });
    }

    const { name } = await params;
    const { oldComment, newComment } = await req.json();

    if (!name || !oldComment || oldComment === ''|| name === ''|| !newComment || newComment === '') {
      return NextResponse.json({ error: 'Recipe name and comment are required' }, { status: 400 });
    }

    const commentOwner = await Recipe.findOne({"comments":{
      $elemMatch: {userName: session.user.name, comment: oldComment.trim()}
    }});
    console.log(session.user.name);
    console.log("Session user", session.user);
    if (!commentOwner) {
      return NextResponse.json({ error: 'User not authorized to edit , Unowned Comment' }, { status: 403 });
    }

    const recipe = await Recipe.findOneAndUpdate(
      { name, "comments.comment": oldComment.trim() },
      { $set: { "comments.$.comment": newComment.trim() } },
      { new: true }
    );

    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Comment updated successfully', recipe }, { status: 200 });
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

    const { name} = await params;
    const {comment} = await req.json();

    if (!name || !comment || comment === "" || name === "") {
      return NextResponse.json({ error: 'Recipe name and comment name are required' }, { status: 400 });
    }

    const recipe = await Recipe.findOneAndUpdate(
      { name },
      { $pull: { comments: { userName: session.user.name, comment: comment } } },
      { new: true }
    );

    if (!recipe) {
      return NextResponse.json({ error: 'You cant Delete this comment as you do not own it.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Comment deleted successfully', recipe }, { status: 200 });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json({ error: 'Error deleting comment' }, { status: 500 });
  }
}