// models/Message.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  receiver_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  message: {
    type: String,
    required: true
  },

  is_read: {
    type: Boolean,
    default: false
  },

  status: {
    type: String,
    enum: ["unread", "read", "replied"],
    default: "unread"
  },

  sent_at: {
    type: Date,
    default: Date.now
  },
});

export default mongoose.model("Message", messageSchema);