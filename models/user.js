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

  security_question: {
    type: String,
    default: ""
  },

  security_answer: {
    type: String,
    default: ""
  },

  fullName: {
    type: String,
    default: ""
  },

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

  address: {
    type: String,
    default: ""
  },

  // ✅ ADD CONTACT FIELD
  contact: {
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