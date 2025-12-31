const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const Product = require("../models/Product");
const Cart = require("../models/Cart");

// ➕ Add to Cart
router.post("/add", protect, async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  try {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = new Cart({ user: userId, items: [] });

    const existing = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res.json(await cart.populate("items.product"));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add to cart" });
  }
});

// 🛍 Get My Cart
router.get("/my", protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch cart" });
  }
});

// ❌ Remove Item
router.delete("/remove/:id", protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((item) => item._id.toString() !== req.params.id);
    await cart.save();
    res.json(await cart.populate("items.product"));
  } catch (err) {
    res.status(500).json({ message: "Failed to remove item" });
  }
});

// 🔄 Update Quantity
router.put("/update/:id", protect, async (req, res) => {
  const { quantity } = req.body;
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.id(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.quantity = quantity;
    await cart.save();
    res.json(await cart.populate("items.product"));
  } catch (err) {
    res.status(500).json({ message: "Failed to update quantity" });
  }
});

module.exports = router;
