import mongoose from "mongoose";
import env from "./env.js";

const connectDB = async () => {
  try {
    await mongoose.connect(env.DB_URL);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("DB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;