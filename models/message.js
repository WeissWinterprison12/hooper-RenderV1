import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  receiver_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  message: String,

  sent_at: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Message", messageSchema);