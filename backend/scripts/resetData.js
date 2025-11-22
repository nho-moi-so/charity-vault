import mongoose from "mongoose";
import dotenv from "dotenv";
import Fund from "../models/Fund.js";
import Donation from "../models/Donation.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, "../.env") });

const resetData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected");

    // Delete all funds
    await Fund.deleteMany({});
    console.log("All funds deleted");

    // Delete all donations
    await Donation.deleteMany({});
    console.log("All donations deleted");

    console.log("Database reset successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error resetting database:", error);
    process.exit(1);
  }
};

resetData();
