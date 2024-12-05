import  connectDB  from '../../../server/connectDB.mjs';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
   
    const connection = await connectDB();
    console.log('Available databases:', await connection.db.admin().listDatabases());


    
    const collections = await connection.db.listCollections().toArray();

    console.log('Collections in DB:', collections);

    return NextResponse.json({ message: 'Collections MongoDB', collections },{status:200});
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ message: 'Error fetching collections' }, { status: 500 });
  }
}
