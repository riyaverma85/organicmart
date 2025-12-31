const mongoose = require("mongoose");

// 🟢 Product Schema
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    image: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      required: [true, "Category is required"], // ✅ Required field
      enum: ["fruits", "vegetables", "dairy", "others"], // ✅ Optional safety check
      trim: true,
    },
  },
  { timestamps: true }
);

// 🟢 Export Model
module.exports = mongoose.model("Product", productSchema);
