import express from "express";
import Message from "../models/message.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const message = new Message(req.body);

    await message.save();

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const messages = await Message.find();

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;