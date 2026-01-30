import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
    // If already connected, return
    if (isConnected) {
        console.log("Using existing database connection");
        return;
    }

    try {
        // Set mongoose options for serverless
        mongoose.set('strictQuery', false);
        
        const db = await mongoose.connect(`${process.env.MONGODB_URI}/hotel-booking`, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        isConnected = db.connections[0].readyState === 1;
        console.log("Database Connected");
    } catch (error) {
        console.log("Database connection error:", error.message);
        throw error;
    }
}

export default connectDB;
