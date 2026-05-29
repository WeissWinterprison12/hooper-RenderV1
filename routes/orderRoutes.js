// routes/orderRoutes.js
import express from "express";
import Order from "../models/order.js";
import mongoose from "mongoose";

const router = express.Router();

// GET ORDERS BY BUYER ID
router.get("/buyer/:buyerId", async (req, res) => {
  try {
    const buyerId = req.params.buyerId;
    
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(buyerId)) {
      return res.status(400).json({ success: false, message: "Invalid buyer ID" });
    }
    
    const orders = await Order.find({ buyer_id: buyerId })
      .populate("items.product_id")
      .sort({ createdAt: -1 });
    
    // Calculate total for each order
    const ordersWithTotal = orders.map(order => {
      const total = order.items.reduce((sum, item) => {
        const price = item.price || 0;
        return sum + (price * item.quantity);
      }, 0);
      
      return {
        _id: order._id,
        buyer_id: order.buyer_id,
        items: order.items,
        total_amount: total,
        status: order.status || "pending",
        payment_method: order.payment_method || "COD",
        createdAt: order.createdAt
      };
    });
    
    res.json({
      success: true,
      orders: ordersWithTotal
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// CREATE NEW ORDER
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

    res.status(201).json({
      success: true,
      order
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;