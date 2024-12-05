import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI ;

async function connectDB() {
  try {
    
    await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
    });
    console.log(uri);
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    
    return mongoose.connection;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  } 
}

export default connectDB;