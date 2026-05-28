import express from "express";
import Cart from "../models/Cart.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const cart = new Cart(req.body);

    await cart.save();

    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:buyerId", async (req, res) => {
  try {
    const cart = await Cart.find({
      buyer_id: req.params.buyerId,
    }).populate("product_id");

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;