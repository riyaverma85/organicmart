import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../css/shop.css";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// Sample product images (keep your imports as before)
import product1 from "../images/product-2.jpg";
import product2 from "../images/product-4.jpg";
// ... import all other product images

const API = import.meta.env.VITE_API_URL || "";

const productsData = [
  {
    category: "Fruits",
    items: [
      { name: "Pineapple", image: product1, priceNew: "$19", priceOld: "$25" },
      { name: "Strawberry", image: product2, priceNew: "$10", priceOld: "$15" },
      // add remaining fruits
    ],
  },
  // add other categories similarly
];

const Shop = () => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch products from backend if available
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API}/api/products`);
        setProducts(res.data);
      } catch (err) {
        console.error(err);
        // fallback to static products if API fails
        setProducts(productsData.flatMap((c) => c.items.map((i) => ({ ...i, category: c.category }))));
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Add to cart handler
  const handleAddToCart = async (product) => {
    const token = auth?.token || localStorage.getItem("token");
    if (!token) {
      Swal.fire("Please login to add items to cart");
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        `${API}/api/cart/add`,
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire({
        icon: "success",
        title: "Added!",
        text: `${product.name} added to cart.`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      Swal.fire(err.response?.data?.message || "Failed to add to cart");
    }
  };

  return (
    <section className="shop-content-section">
      <div className="containerr">
        {/* Main Banner */}
        <div className="shop-banner">
          <h1>🌿 Explore Our Organic Products</h1>
          <p>Fresh, healthy, and chemical-free products straight from local farms to your doorstep.</p>
          <button className="shop-btn" onClick={() => navigate("/add-product")}>Shop Now</button>
        </div>

        {/* Products Section */}
        <div className="products-section">
          <h2>Featured Products</h2>
          {loading ? (
            <p>Loading products...</p>
          ) : (
            <div className="products-grid">
              {products.map((product, idx) => (
                <div key={idx} className="product-card">
                  <div className="product-img">
                    <img src={product.image} alt={product.name} />
                    <span className="product-badge">New</span>
                  </div>
                  <div className="product-content">
                    <h4>{product.name}</h4>
                    <div className="price">
                      <span className="new-price">{product.priceNew || `$${product.price}`}</span>
                      {product.priceOld && <span className="old-price">{product.priceOld}</span>}
                    </div>
                    <div className="product-buttons">
                      <button className="cart-btn" onClick={() => handleAddToCart(product)}>Add to Cart</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Shop;
