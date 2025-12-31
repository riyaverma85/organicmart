const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const Product = require("../models/Product");


// 🟢 Add new product (Admin only)
router.post("/", protect, adminOnly, upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, category } = req.body; // ✅ category added

    // Validation
    if (!name || !price || !category) {
      return res
        .status(400)
        .json({ message: "Name, price, and category are required" });
    }

    const image = req.file ? req.file.path : null;

    const product = await Product.create({
      name,
      description,
      price,
      image,
      category,
    });

    res.json({
      success: true,
      message: "✅ Product added successfully",
      product,
    });
  } catch (error) {
    console.error("❌ Error adding product:", error);
    res.status(500).json({ message: "Failed to add product" });
  }
});


// 🟡 Get all products (with search + category filter)
router.get("/", async (req, res) => {
  try {
    const search = req.query.search || "";
    const category = req.query.category || "";

    const query = {};

    // 🔍 Search by name (case-insensitive)
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // 🏷️ Filter by category (case-insensitive)
    if (category) {
      query.category = { $regex: category, $options: "i" };
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});


// 🟠 Update product (Admin only)
router.put("/:id", protect, adminOnly, upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    const updateData = { name, description, price, category };

    if (req.file) updateData.image = req.file.path; // ✅ handle image upload

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedProduct)
      return res.status(404).json({ message: "Product not found" });

    res.json({
      success: true,
      message: "✅ Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("❌ Error updating product:", error);
    res.status(500).json({ message: "Failed to update product" });
  }
});


// 🔴 Delete product (Admin only)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Product not found" });

    res.json({
      success: true,
      message: "🗑️ Product deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    res.status(500).json({ message: "Failed to delete product" });
  }
});


// 🔍 Get single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (err) {
    console.error("❌ Error fetching product:", err);
    res.status(500).json({ message: "Failed to fetch product" });
  }
});


// ✅ Export router
module.exports = router;
