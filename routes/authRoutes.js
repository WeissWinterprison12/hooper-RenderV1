// routes/authRoutes.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { 
      username, 
      email, 
      password, 
      role,
      fullName,
      birthday,
      address,
      contact,
      security_question,
      security_answer
    } = req.body;

    // ✅ FIX: Check existing email (case-insensitive)
    const existingEmail = await User.findOne({ email: email.toLowerCase() });

    if (existingEmail) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    // ✅ FIX: Check existing username (case-insensitive)
    const existingUsername = await User.findOne({ 
      username: { $regex: new RegExp(`^${username}$`, 'i') } 
    });

    if (existingUsername) {
      return res.status(400).json({
        message: "Username already taken",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let hashedSecurityAnswer = "";
    if (security_answer) {
      hashedSecurityAnswer = await bcrypt.hash(security_answer, 10);
    }

    const user = new User({
      username,
      email: email.toLowerCase(), // ✅ Store email in lowercase
      password: hashedPassword,
      role: role || "buyer",
      fullName: fullName || "",
      birthday: birthday || { month: "", day: null, year: null },
      address: address || "",
      contact: contact || "",
      security_question: security_question || "",
      security_answer: hashedSecurityAnswer || ""
    });

    await user.save();

    res.status(201).json({
      message: "Registration successful",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide both email/username and password",
      });
    }

    let user;
    
    // ✅ FIX: Check if input is email or username (case-insensitive)
    if (email.includes('@')) {
      // For email - use lowercase
      user = await User.findOne({ email: email.toLowerCase() });
    } else {
      // For username - use regex with 'i' flag
      user = await User.findOne({ 
        username: { $regex: new RegExp(`^${email}$`, 'i') } 
      });
    }

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { email, security_question, security_answer, newPassword } = req.body;

    let user;
    
    // ✅ FIX: Handle both email and username (case-insensitive)
    if (email.includes('@')) {
      user = await User.findOne({ email: email.toLowerCase() });
    } else {
      user = await User.findOne({ 
        username: { $regex: new RegExp(`^${email}$`, 'i') } 
      });
    }

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    if (user.security_question !== security_question) {
      return res.status(400).json({
        message: "Security question does not match",
      });
    }

    const isAnswerMatch = await bcrypt.compare(security_answer, user.security_answer);
    
    if (!isAnswerMatch) {
      return res.status(400).json({
        message: "Security answer is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      message: "Password reset successful! You can now login with your new password.",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;