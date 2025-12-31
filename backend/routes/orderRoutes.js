const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const Order = require("../models/Order");
const Product = require("../models/Product");

// 📦 Place new order
router.post("/", protect, async (req, res) => {
  const { products, totalPrice } = req.body;

  if (!products || products.length === 0) {
    return res.status(400).json({ message: "No products in order" });
  }

  const newOrder = await Order.create({
    user: req.user._id,
    products,
    totalPrice,
    status: "pending",
  });

  res.json(newOrder);
});

// 👤 Get logged-in user's orders
router.get("/my", protect, async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate("products.product")
    .sort({ createdAt: -1 });
  res.json(orders);
});

module.exports = router;
