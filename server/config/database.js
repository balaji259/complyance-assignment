const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log(process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI,{
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
  });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
