import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  seller_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  product_name: String,
  description: String,
  category: String,
  price: Number,
  stock: Number,
  image: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;