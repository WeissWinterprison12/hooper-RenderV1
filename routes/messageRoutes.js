// messageRoutes.js
import express from "express";
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

    const newMessage = new Message({
      sender_id,
      receiver_id,
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

// Get messages for a SELLER (used in seller_messages.jsx)
router.get("/seller/:sellerId", async (req, res) => {
  try {
    const { sellerId } = req.params;

    const messages = await Message.find({ 
      receiver_id: sellerId 
    })
      .populate("sender_id", "username fullName email profile_image")
      .sort({ sent_at: -1 });

    // Add is_read field for frontend
    const messagesWithRead = messages.map(msg => ({
      ...msg.toObject(),
      is_read: msg.is_read || false,
      fullname: msg.sender_id?.fullName || msg.sender_id?.username || "Buyer",
      sender_username: msg.sender_id?.username || "buyer"
    }));

    res.json({ success: true, messages: messagesWithRead });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ NEW: Get messages for a BUYER
router.get("/buyer/:buyerId", async (req, res) => {
  try {
    const { buyerId } = req.params;

    const messages = await Message.find({ 
      receiver_id: buyerId 
    })
      .populate("sender_id", "username fullName email profile_image")
      .populate("receiver_id", "username fullName email")
      .sort({ sent_at: -1 });

    // Add is_read field for frontend
    const messagesWithRead = messages.map(msg => ({
      ...msg.toObject(),
      is_read: msg.is_read || false,
      fullname: msg.sender_id?.fullName || msg.sender_id?.username || "Seller",
      sender_username: msg.sender_id?.username || "seller"
    }));

    res.json({ success: true, messages: messagesWithRead });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ NEW: Get messages SENT by a buyer (their sent messages)
router.get("/buyer/:buyerId/sent", async (req, res) => {
  try {
    const { buyerId } = req.params;

    const messages = await Message.find({ 
      sender_id: buyerId 
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
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mark message as read
router.put("/:id/read", async (req, res) => {
  try {
    const { id } = req.params;
    const { seller_id } = req.body;

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

    await Message.findByIdAndDelete(id);

    res.json({ success: true, message: "Message deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;