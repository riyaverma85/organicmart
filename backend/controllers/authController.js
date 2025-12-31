// backend/controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ✅ Always recreate admin safely if needed
const createAdminIfNotExists = async () => {
  try {
    const email = process.env.ADMIN_EMAIL;
    const pwd = process.env.ADMIN_PASSWORD;
    if (!email || !pwd) {
      console.warn("⚠️ Admin env not set");
      return;
    }

    const existing = await User.findOne({ email });
    if (existing) {
      // Force recreate for consistent password
      await User.deleteOne({ email });
    }

    const hash = await bcrypt.hash(pwd, 10);
    await User.create({
      name: "Admin",
      email,
      password: hash,
      role: "admin",
    });

    // console.log("🛠 Fresh admin created:", email);
  } catch (err) {
    console.error("Admin seed error:", err);
  }
};

// ✅ REGISTER CONTROLLER
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already registered" });

    const user = await User.create({ name, email, password });

    return res.status(201).json({
      message: "Registered successfully",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ LOGIN CONTROLLER (Fixed)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // 🔹 Check if admin (env email & password)
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      // Admin login successful
      const admin = await User.findOne({ email });
      let token;
      if (admin) {
        // Generate JWT for admin from DB
        token = jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "7d" });
      } else {
        // Admin user not yet in DB? create now
        const hash = await bcrypt.hash(password, 10);
        const newAdmin = await User.create({
          name: "Admin",
          email,
          password: hash,
          role: "admin",
        });
        token = jwt.sign({ id: newAdmin._id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "7d" });
      }

      return res.json({
        token,
        user: { id: admin?._id || newAdmin._id, name: "Admin", email, role: "admin" },
      });
    }

    // 🔹 Check normal user
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not registered. Please register first." });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


// ✅ Admin dashboard
exports.adminDashboard = async (req, res) => {
  res.json({ message: `Welcome admin ${req.user.name}` });
};

// ✅ Export
module.exports.createAdminIfNotExists = createAdminIfNotExists;
