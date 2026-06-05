// models/product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  // ✅ FIX: Change from ObjectId to String
  seller_id: {
    type: String,  // STRING, not ObjectId
    required: true,
    index: true
  },

  product_name: {
    type: String,
    required: true
  },
  description: String,
  category: String,
  price: Number,
  stock: Number,
  image: String,

  createdAt: {
    type: Date,
    default: Date.now
  },
});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;