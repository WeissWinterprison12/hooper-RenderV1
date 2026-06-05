// seed.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/user.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🔌 MongoDB Connected");

    // Check if email already exists
    const existingUser = await User.findOne({ email: "Shanezblankc@gmail.com" });
    
    if (existingUser) {
      // ✅ UPDATE existing user to admin instead
      console.log("⚠️ Email exists as buyer, updating to admin...");
      
      existingUser.role = "admin";
      existingUser.username = "Administrator";
      existingUser.security_question = "What is the name of your first pet?";
      existingUser.security_answer = await bcrypt.hash("Shitzu", 10);
      existingUser.contact = "09396014810";
      
      await existingUser.save();
      
      console.log("✅ User upgraded to Admin successfully!");
      console.log("");
      console.log("📋 Login with:");
      console.log("  Email:    Shanezblankc@gmail.com");
      console.log("  Password: Zzrotporta1234 (your current buyer password)");
      console.log("  OR reset it in login → forgot password");
      
      process.exit();
    }

    // CREATE NEW ADMIN
    const adminPassword = await bcrypt.hash("Zzrotporta1234", 10);

    const admin = new User({
      username: "Administrator",
      email: "Shanezblankc@gmail.com",
      password: adminPassword,
      role: "admin",
      fullName: "Administrator",
      security_question: "What is the name of your first pet?",
      security_answer: await bcrypt.hash("Shitzu", 10),
      contact: "09396014810"
    });

    await admin.save();

    console.log("✅ Admin created successfully!");
    console.log("");
    console.log("📋 Credentials:");
    console.log("  Email:    Shanezblankc@gmail.com");
    console.log("  Password: Zzrotporta1234");

    process.exit();
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
};

createAdmin();