import mongoose from 'mongoose';

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/expense_tracker';

// Beginner-friendly: single connect with basic error log
export default async function connectDatabase() {
  try {
    await mongoose.connect(mongoUri);
    console.log('🟢 MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error?.message || error);
  }
}

