import express from "express";
import Product from "../models/product.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads/products");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) return cb(null, true);
    cb(new Error("Only image files are allowed!"));
  }
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { seller_id, product_name, description, category, price, stock } = req.body;
    
    const productData = {
      seller_id: seller_id,
      product_name,
      description: description || "",
      category: category || "general",
      price: parseFloat(price) || 0,
      stock: parseInt(stock) || 0,
    };
    
    if (req.file) {
      productData.image = `/uploads/products/${req.file.filename}`;
    }
    
    const product = new Product(productData);
    await product.save();
    
    console.log("✅ Product created:", product._id);
    
    res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    console.error("❌ Error creating product:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/seller/:sellerId", async (req, res) => {
  try {
    const { sellerId } = req.params;
    
    const products = await Product.find({ seller_id: sellerId }).sort({ createdAt: -1 });
    
    console.log("📡 Found products:", products.length, "for seller:", sellerId);
    
    res.json({ success: true, products });
  } catch (error) {
    console.error("❌ Error fetching seller products:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { product_name, description, category, price, stock } = req.body;
    
    const updateData = {};
    if (product_name) updateData.product_name = product_name;
    if (description !== undefined) updateData.description = description;
    if (category) updateData.category = category;
    if (price) updateData.price = parseFloat(price);
    if (stock) updateData.stock = parseInt(stock);
    
    if (req.file) {
      const oldProduct = await Product.findById(req.params.id);
      if (oldProduct?.image && !oldProduct.image.startsWith("http")) {
        try {
          const oldPath = path.join(__dirname, "../", oldProduct.image);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        } catch (err) {
          console.log("Could not delete old image:", err.message);
        }
      }
      updateData.image = `/uploads/products/${req.file.filename}`;
    }
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    
    res.json({ success: true, product });
  } catch (error) {
    console.error("❌ Error updating product:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    
    if (product.image && !product.image.startsWith("http")) {
      try {
        const imagePath = path.join(__dirname, "../", product.image);
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
      } catch (err) {
        console.log("Could not delete image:", err.message);
      }
    }
    
    res.json({ success: true, message: "Product deleted" });
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/reduce-stock/:id", async (req, res) => {
  try {
    const { quantity } = req.body;
    const productId = req.params.id;
    
    console.log("📡 Reducing stock for product:", productId, "quantity:", quantity);

    const product = await Product.findById(productId);
    
    if (!product) {
      console.log("❌ Product not found:", productId);
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const currentStock = parseInt(product.stock) || 0;
    const reduceQty = parseInt(quantity) || 1;
    const newStock = Math.max(0, currentStock - reduceQty);
    
    console.log("📡 Stock change:", currentStock, "->", newStock);
    
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { stock: newStock },
      { new: true }
    );
    
    console.log("📡 Stock reduced successfully:", updatedProduct);
    
    res.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error("❌ Error reducing stock:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;