// routes/authRoutes.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    // ✅ Extract all fields from request body
    const { 
      username, 
      email, 
      password, 
      role,
      fullName,
      birthday,
      address,
      security_question,
      security_answer
    } = req.body;

    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    const existingUsername = await User.findOne({ username });

    if (existingUsername) {
      return res.status(400).json({
        message: "Username already taken",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Hash security answer if provided
    let hashedSecurityAnswer = "";
    if (security_answer) {
      hashedSecurityAnswer = await bcrypt.hash(security_answer, 10);
    }

    // ✅ Include all fields when creating user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "buyer",
      fullName: fullName || "",
      birthday: birthday || { month: "", day: null, year: null },
      address: address || "",
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

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
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

// ✅ RESET PASSWORD (with security question)
router.post("/reset-password", async (req, res) => {
  try {
    const { email, security_question, security_answer, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Email not found",
      });
    }

    // Check security question
    if (user.security_question !== security_question) {
      return res.status(400).json({
        message: "Security question does not match",
      });
    }

    // Check security answer
    const isAnswerMatch = await bcrypt.compare(security_answer, user.security_answer);
    
    if (!isAnswerMatch) {
      return res.status(400).json({
        message: "Security answer is incorrect",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
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