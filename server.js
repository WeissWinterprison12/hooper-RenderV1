// messageRoutes.js
import express from "express";
import mongoose from "mongoose";
import Message from "../models/message.js";

const router = express.Router();

// Create a new message
router.post("/", async (req, res) => {
  try {
    const { sender_id, receiver_id, message } = req.body;

    if (!sender_id || !receiver_id || !message) {
      return res.status(400).json({ 
        success: false,
        message: "sender_id, receiver_id, and message are required" 
      });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(sender_id) || !mongoose.Types.ObjectId.isValid(receiver_id)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid sender_id or receiver_id format" 
      });
    }

    const newMessage = new Message({
      sender_id: new mongoose.Types.ObjectId(sender_id),
      receiver_id: new mongoose.Types.ObjectId(receiver_id),
      message,
      sent_at: new Date()
    });

    await newMessage.save();

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage
    });
  } catch (error) {
    console.error("❌ Error sending message:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all messages (admin)
router.get("/", async (req, res) => {
  try {
    const messages = await Message.find()
      .populate("sender_id", "username fullName email")
      .populate("receiver_id", "username fullName email")
      .sort({ sent_at: -1 });

    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get messages for a SELLER
router.get("/seller/:sellerId", async (req, res) => {
  try {
    const { sellerId } = req.params;

    // Validate and convert to ObjectId
    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(400).json({ success: false, message: "Invalid seller ID" });
    }

    const objectId = new mongoose.Types.ObjectId(sellerId);

    const messages = await Message.find({ 
      receiver_id: objectId 
    })
      .populate("sender_id", "username fullName email profile_image")
      .sort({ sent_at: -1 });

    const messagesWithRead = messages.map(msg => ({
      ...msg.toObject(),
      is_read: msg.is_read || false,
      fullname: msg.sender_id?.fullName || msg.sender_id?.username || "Buyer",
      sender_username: msg.sender_id?.username || "buyer"
    }));

    res.json({ success: true, messages: messagesWithRead });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ FIXED: Get INBOX messages for a BUYER
router.get("/buyer/:buyerId", async (req, res) => {
  try {
    const { buyerId } = req.params;

    // Validate and convert to ObjectId
    if (!mongoose.Types.ObjectId.isValid(buyerId)) {
      return res.status(400).json({ success: false, message: "Invalid buyer ID" });
    }

    const objectId = new mongoose.Types.ObjectId(buyerId);

    const messages = await Message.find({ 
      receiver_id: objectId 
    })
      .populate("sender_id", "username fullName email profile_image")
      .populate("receiver_id", "username fullName email")
      .sort({ sent_at: -1 });

    const messagesWithRead = messages.map(msg => ({
      ...msg.toObject(),
      is_read: msg.is_read || false,
      fullname: msg.sender_id?.fullName || msg.sender_id?.username || "Seller",
      sender_username: msg.sender_id?.username || "seller"
    }));

    res.json({ success: true, messages: messagesWithRead });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ FIXED: Get SENT messages for a BUYER
router.get("/buyer/:buyerId/sent", async (req, res) => {
  try {
    const { buyerId } = req.params;

    // Validate and convert to ObjectId
    if (!mongoose.Types.ObjectId.isValid(buyerId)) {
      return res.status(400).json({ success: false, message: "Invalid buyer ID" });
    }

    const objectId = new mongoose.Types.ObjectId(buyerId);

    const messages = await Message.find({ 
      sender_id: objectId 
    })
      .populate("receiver_id", "username fullName email profile_image")
      .sort({ sent_at: -1 });

    const messagesWithData = messages.map(msg => ({
      ...msg.toObject(),
      fullname: msg.receiver_id?.fullName || msg.receiver_id?.username || "Seller",
      sender_username: msg.receiver_id?.username || "seller"
    }));

    res.json({ success: true, messages: messagesWithData });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mark message as read
router.put("/:id/read", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid message ID" });
    }

    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    message.is_read = true;
    message.status = "read";
    await message.save();

    res.json({ success: true, message: "Message marked as read" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete a message
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid message ID" });
    }

    await Message.findByIdAndDelete(id);

    res.json({ success: true, message: "Message deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;