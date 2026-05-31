// models/user.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 6,
    maxlength: 15
  },

  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true,
    minlength: 8
  },

  role: {
    type: String,
    enum: ["buyer", "seller", "admin"],
    default: "buyer"
  },

  profile_image: {
    type: String,
    default: ""
  },

  // ✅ SECURITY QUESTION FIELDS (already exist, just making sure)
  security_question: {
    type: String,
    default: ""
  },

  security_answer: {
    type: String,
    default: ""
  },

  // ✅ FULL NAME
  fullName: {
    type: String,
    default: ""
  },

  // ✅ BIRTHDAY
  birthday: {
    month: {
      type: String,
      default: ""
    },
    day: {
      type: Number,
      default: null
    },
    year: {
      type: Number,
      default: null
    }
  },

  // ✅ ADDRESS
  address: {
    type: String,
    default: ""
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model("User", userSchema);

export default User;