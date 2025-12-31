
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const connectDB = require("./config/db");
const { createAdminIfNotExists } = require("./controllers/authController");

// ✅ Import all routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");
const contactRoutes = require("./routes/contactRoutes");

//  CORS configuration (important)
app.use(
   cors(
  //{
  //   origin: "http://localhost:5173", // React app URL
  //   credentials: true,              // cookies / credentials allow
  // }
));

// ✅ Middleware
app.use(express.json());

// ✅ Connect to MongoDB and create admin if not exists
connectDB().then(() => createAdminIfNotExists());


// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/contact", contactRoutes);

//  Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

//  Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
