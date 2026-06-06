// routes/cartRoutes.js - UPDATED
import express from "express";
import Cart from "../models/cart.js";
import mongoose from "mongoose";

const router = express.Router();

// ✅ GET CART BY USER ID
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find cart for this user and populate product details
    const cart = await Cart.findOne({ user_id: userId })
      .populate("products.product_id", "product_name price image stock seller_id");
    
    if (!cart) {
      return res.json({ success: true, items: [] });
    }
    
    res.json({ success: true, items: cart.products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ CREATE/ADD TO CART
router.post("/", async (req, res) => {
  try {
    const { user_id, products } = req.body;
    
    if (!user_id || !products || products.length === 0) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }
    
    // Check if cart already exists for this user
    let cart = await Cart.findOne({ user_id });
    
    if (cart) {
      // Add new products to existing cart
      for (const newProduct of products) {
        // Check if product already exists in cart
        const existingIndex = cart.products.findIndex(
          p => p.product_id.toString() === newProduct.product_id
        );
        
        if (existingIndex > -1) {
          // Increment quantity if already exists
          cart.products[existingIndex].quantity += newProduct.quantity || 1;
        } else {
          // Add new product
          cart.products.push(newProduct);
        }
      }
      
      await cart.save();
      return res.json({ success: true, message: "Cart updated", cart });
    } else {
      // Create new cart
      cart = new Cart({
        user_id,
        products
      });
      
      await cart.save();
      return res.json({ success: true, message: "Added to cart", cart });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ UPDATE QUANTITY
router.put("/update", async (req, res) => {
  try {
    const { itemId, quantity, userId } = req.body;
    
    const cart = await Cart.findOne({ user_id: userId });
    
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }
    
    const productIndex = cart.products.findIndex(
      p => p._id.toString() === itemId
    );
    
    if (productIndex === -1) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    
    if (quantity <= 0) {
      // Remove item
      cart.products.splice(productIndex, 1);
    } else {
      cart.products[productIndex].quantity = quantity;
    }
    
    await cart.save();
    res.json({ success: true, message: "Quantity updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ REMOVE ITEM
router.delete("/remove/:itemId", async (req, res) => {
  try {
    const { itemId } = req.params;
    const { userId } = req.body;
    
    const cart = await Cart.findOne({ user_id: userId });
    
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }
    
    cart.products = cart.products.filter(
      p => p._id.toString() !== itemId
    );
    
    await cart.save();
    res.json({ success: true, message: "Item removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ LEGACY: REMOVE ITEM (POST - for backward compatibility)
router.post("/remove", async (req, res) => {
  try {
    const { user_id, product_id } = req.body;
    
    await Cart.findOneAndDelete({
      user_id: user_id,
      "products.product_id": product_id
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;