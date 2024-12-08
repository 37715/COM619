import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI ;

let isConnected = false;

async function connectDB() {
  if (isConnected) {
    console.log("Using existing connection.");
    return mongoose
  }

  try {
    await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log("Successfully connected to MongoDB.");
    return mongoose.connection;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error("Database connection failed");
  } 
}

export default connectDB;