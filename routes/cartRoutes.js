// routes/cartRoutes.js - FIXED
import express from "express";
import Cart from "../models/cart.js";
import mongoose from "mongoose";

const router = express.Router();

// CREATE CART
router.post("/", async (req, res) => {
  try {
    const cart = new Cart(req.body);
    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ FIXED: GET CART BY USER ID (use user_id to match model)
router.get("/:userId", async (req, res) => {
  try {
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const cart = await Cart.find({
      user_id: req.params.userId
    }).populate("products.product_id");

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// REMOVE ITEM FROM CART
router.post("/remove", async (req, res) => {
  try {
    const { user_id, product_id } = req.body;
    
    await Cart.findOneAndDelete({
      user_id: user_id,
      "products.product_id": product_id
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;