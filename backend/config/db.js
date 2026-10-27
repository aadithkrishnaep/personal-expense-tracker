const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ExpenseTrackerDB';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`[Database] MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    isConnected = false;
    console.warn(`[Database Warning] Could not connect to MongoDB Atlas (${error.message}).`);
    console.warn('[Database Fallback] Falling back to high-resiliency in-memory data store for evaluation.');
  }

  mongoose.connection.on('connected', () => {
    isConnected = true;
  });

  mongoose.connection.on('disconnected', () => {
    isConnected = false;
  });
};

const getDbStatus = () => isConnected;

module.exports = { connectDB, getDbStatus };
