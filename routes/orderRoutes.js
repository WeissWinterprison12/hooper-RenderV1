// routes/orderRoutes.js - FIXED
import express from "express";
import Order from "../models/order.js";
import Product from "../models/product.js";
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

// ✅ GET ORDERS BY SELLER
router.get("/seller/:sellerId", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.sellerId)) {
      return res.status(400).json({ success: false, message: "Invalid seller ID" });
    }
    
    // First, get all products by this seller
    const products = await Product.find({ seller_id: req.params.sellerId });
    const productIds = products.map(p => p._id);
    
    // Then, find orders that contain any of these products
    const orders = await Order.find({
      "items.product_id": { $in: productIds }
    })
    .populate("items.product_id")
    .sort({ createdAt: -1 });
    
    console.log("📡 Seller orders fetched:", orders.length);
    
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