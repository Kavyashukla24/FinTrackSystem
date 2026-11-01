const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI || !mongoURI.startsWith("mongodb://") && !mongoURI.startsWith("mongodb+srv://")) {
      throw new Error("Invalid MONGO_URI. Check your .env file.");
    }

    await mongoose.connect(mongoURI);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;