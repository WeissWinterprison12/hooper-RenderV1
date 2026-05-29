// routes/orderRoutes.js - FIXED
import express from "express";
import Order from "../models/order.js";
import mongoose from "mongoose";

const router = express.Router();

// ✅ GET ORDERS BY BUYER
router.get("/buyer/:buyerId", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.buyerId)) {
      return res.status(400).json({ success: false, message: "Invalid buyer ID" });
    }
    
    const orders = await Order.find({ buyer_id: req.params.buyerId })
      .populate("items.product_id")
      .sort({ createdAt: -1 });
    
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// CREATE ORDER
router.post("/", async (req, res) => {
  try {
    const { buyer_id, items, payment_method } = req.body;
    
    const total_price = items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
    
    const order = new Order({
      buyer_id,
      items,
      total_price,
      payment_method: payment_method || "COD",
      status: "pending"
    });

    await order.save();
    await order.populate("items.product_id");

    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;