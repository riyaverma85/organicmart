import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext";
import "../css/productdetails.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

const ProductDetails = () => {
  const { id } = useParams();
  const { auth, setCartCount } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API}/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        Swal.fire("Error", "Failed to load product details", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    const token = auth?.token || localStorage.getItem("token");

    if (!token) {
      // 🔹 Redirect to login page with return path
      navigate("/login", { state: { from: `/product/${id}` } });
      return;
    }

    try {
      const res = await axios.post(
        `${API}/api/cart/add`,
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCartCount(res.data?.items?.length || 0);

      Swal.fire({
        icon: "success",
        title: "Added!",
        text: "Product added to cart successfully!",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to add to cart",
        "error"
      );
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div className="product-details">
      <img src={product.image} alt={product.name} className="product-image" />
      <div className="product-info">
        <h2>{product.name}</h2>
        <p className="price">₹{product.price}</p>
        <p className="desc">{product.description}</p>
        <button className="add-btn" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
