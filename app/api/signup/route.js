import { NextResponse } from 'next/server';
import connectDB from '@/server/connectDB.mjs';
import User from '@/server/models/User.mjs';

export async function POST(req) {
  try {
    await connectDB();
    const { username, password } = await req.json();

    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json({ error: 'Username already Taken, please choose another.' }, { status: 400 });
    }

    // Create a new user
    const newUser = new User({ username, password });
    await newUser.save();

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Error creating user' }, { status: 500 });
  }
}


