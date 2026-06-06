// routes/userRoutes.js
import express from "express";
import User from "../models/user.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const BACKEND_URL = "https://hooper-renderv1-4.onrender.com";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads/profiles");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed!"));
  }
});

// ✅ IMPORTANT: More specific routes MUST come BEFORE parameterized routes like /:id

// GET all sellers - Put this FIRST (before /:id)
router.get("/sellers", async (req, res) => {
  try {
    const sellers = await User.find({ role: "seller" })
      .select("username fullName email profile_image")
      .lean();

    // Add full URL to profile images
    const sellersWithImages = sellers.map(seller => ({
      ...seller,
      profile_image: seller.profile_image 
        ? `${BACKEND_URL}${seller.profile_image}`
        : null
    }));

    res.json({ success: true, users: sellersWithImages });
  } catch (error) {
    console.error("Error fetching sellers:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET user by ID - This comes AFTER /sellers
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const user = await User.findById(req.params.id).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const userObj = user.toObject();
    if (userObj.profile_image && !userObj.profile_image.startsWith("http")) {
      userObj.profile_image = `${BACKEND_URL}${userObj.profile_image}`;
    }
    
    res.json(userObj);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT update user
router.put("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const { 
      fullName,
      username,
      address,
      birthday,
      security_question,
      security_answer,
      currentPassword,
      newPassword
    } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const updateData = {};
    
    if (fullName) updateData.fullName = fullName;
    if (username) updateData.username = username;
    if (address) updateData.address = address;
    
    if (birthday) {
      try {
        updateData.birthday = typeof birthday === "string" ? JSON.parse(birthday) : birthday;
      } catch (e) {
        updateData.birthday = birthday;
      }
    }
    
    if (security_question) updateData.security_question = security_question;
    if (security_answer) {
      updateData.security_answer = await bcrypt.hash(security_answer, 10);
    }
    
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
      
      updateData.password = await bcrypt.hash(newPassword, 10);
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { returnDocument: "after", runValidators: true }
    ).select("-password");
    
    const userObj = updatedUser.toObject();
    if (userObj.profile_image && !userObj.profile_image.startsWith("http")) {
      userObj.profile_image = `${BACKEND_URL}${userObj.profile_image}`;
    }
    
    res.json(userObj);
  } catch (error) {
    console.error("Error in update:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// PUT update user profile image
router.put("/:id/image", upload.single("profile_image"), async (req, res) => {
  try {
    const userId = req.params.id;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    
    const updateData = {};
    
    if (user.profile_image && !user.profile_image.startsWith("http")) {
      try {
        const oldPath = path.join(__dirname, "../", user.profile_image);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      } catch (err) {
        console.log("Could not delete old image:", err.message);
      }
    }
    
    updateData.profile_image = `/uploads/profiles/${req.file.filename}`;
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { returnDocument: "after", runValidators: true }
    ).select("-password");
    
    const response = {
      ...updatedUser.toObject(),
      profile_image: `${BACKEND_URL}/uploads/profiles/${req.file.filename}`
    };
    
    res.json(response);
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

export default router;