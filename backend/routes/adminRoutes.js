const router = require("express").Router();
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const { adminDashboard } = require("../controllers/authController");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Contact =require("../models/Contact")

// ✅ Admin Dashboard summary
router.get("/dashboard", protect, adminOnly, adminDashboard);

// ✅ Get all users (already added earlier)
router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server Error while fetching users" });
  }
});

// ✅ NEW: Get all orders for admin
router.get("/orders", protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("products.product", "name price")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server Error while fetching orders" });
  }
});

// ✅ Update order status
router.put("/orders/:id", protect, adminOnly, async (req, res) => {
  const { status } = req.body;
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating order status" });
  }
});

// ✅ Dashboard stats
router.get("/stats", protect, adminOnly, async (req, res) => {
  const users = await User.countDocuments();
  const products = await Product.countDocuments();
  const orders = await Order.countDocuments();
  const contacts=await Contact.countDocuments();
  res.json({ users, products, orders,contacts });
});

module.exports = router;
