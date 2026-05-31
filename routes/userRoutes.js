// routes/userRoutes.js
import express from "express";
import User from "../models/user.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const router = express.Router();

// GET USER PROFILE BY ID
router.get("/:id", async (req, res) => {
  try {
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const user = await User.findById(req.params.id).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json(user);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE USER PROFILE
router.put("/:id", async (req, res) => {
  try {
    const { 
      username, 
      profile_image,
      fullName,
      birthday,
      address,
      security_question,
      security_answer,
      currentPassword,
      newPassword
    } = req.body;
    
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const updateData = {};
    
    // Basic fields
    if (username) updateData.username = username;
    if (profile_image) updateData.profile_image = profile_image;
    
    // ✅ NEW FIELDS - Personal Info
    if (fullName) updateData.fullName = fullName;
    if (address) updateData.address = address;
    if (birthday) updateData.birthday = birthday;
    
    // ✅ Security Question
    if (security_question) updateData.security_question = security_question;
    if (security_answer) {
      updateData.security_answer = await bcrypt.hash(security_answer, 10);
    }
    
    // ✅ Password Change (requires current password)
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
      
      updateData.password = await bcrypt.hash(newPassword, 10);
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");
    
    res.json(updatedUser);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;