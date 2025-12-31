import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../css/addproduct.css";
import { AuthContext } from "../context/AuthContext";

const AddProduct = () => {
  const API = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const { auth, cartCount, setCartCount } = useContext(AuthContext);
  const [active, setActive] = useState("shop");
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const token = auth?.token;

  // 🟢 Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API}/api/products`);
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  // 🟡 Fetch cart
  const fetchCart = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${API}/api/cart/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data?.items || []);
      setCartCount(res.data?.items?.length || 0);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  // 🟣 Fetch orders
  const fetchOrders = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${API}/api/orders/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCart();
    fetchOrders();
  }, [token]);

  // 🛒 Add to cart
  const addToCart = async (p) => {
    if (!token) {
      Swal.fire("Please login first!");
      return;
    }

    const already = cart.find(
      (item) => (item.product?._id || item.product) === p._id
    );

    if (already) {
      Swal.fire({
        icon: "info",
        title: "Already Added!",
        text: "This product is already in your cart.",
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    try {
      await axios.post(
        `${API}/api/cart/add`,
        { productId: p._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire({
        icon: "success",
        title: "Added!",
        text: "Product added to cart.",
        timer: 1500,
        showConfirmButton: false,
      });

      fetchCart();
    } catch (err) {
      console.error("Error adding to cart:", err);
      Swal.fire("Error", "Failed to add to cart.", "error");
    }
  };

  // 🔄 Update quantity
  const updateQuantity = async (id, quantity) => {
    try {
      await axios.put(
        `${API}/api/cart/update/${id}`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
    } catch {
      Swal.fire("Error", "Failed to update quantity.", "error");
    }
  };

  // ❌ Remove item
  const removeItem = async (id) => {
    try {
      await axios.delete(`${API}/api/cart/remove/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCart();
    } catch {
      Swal.fire("Error", "Failed to remove item.", "error");
    }
  };

  // 💰 Total cart price
  const totalCartPrice = () =>
    cart
      .filter((c) => c.product)
      .reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // 🧾 Place order
  const placeOrder = async () => {
    if (!cart.length) {
      Swal.fire("Empty Cart", "Please add products first.", "info");
      return;
    }

    const productsToSend = cart
      .filter((c) => c.product)
      .map((c) => ({
        product: c.product._id,
        quantity: c.quantity,
      }));

    try {
      await axios.post(
        `${API}/api/orders`,
        { products: productsToSend, totalPrice: totalCartPrice() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire("Order Placed!", "Your order has been placed successfully!", "success");
      fetchCart();
      fetchOrders();
    } catch {
      Swal.fire("Error", "Failed to place order.", "error");
    }
  };

  return (
    <div className="user-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>User Panel</h2>
        <ul>
          <li
            className={active === "shop" ? "active" : ""}
            onClick={() => setActive("shop")}
          >
            🛍 Shop
          </li>
          <li
            className={active === "cart" ? "active" : ""}
            onClick={() => setActive("cart")}
          >
            🛒 My Cart {cartCount > 0 && `(${cartCount})`}
          </li>
          <li
            className={active === "orders" ? "active" : ""}
            onClick={() => setActive("orders")}
          >
            📦 My Orders
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* 🛍 SHOP */}
        {active === "shop" && (
          <div className="shop-section">
            <h2>Organic Products</h2>
            <div className="product-grid">
              {products.map((p) => (
                <div key={p._id} className="product-card">
                  <img src={p.image} alt={p.name} />
                  <h4>{p.name}</h4>
                  <p>{p.description}</p>
                  <b>₹{p.price}</b>
                  <p className="category">Category: {p.category}</p>
                  <button onClick={() => addToCart(p)}>Add to Cart</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 🛒 CART */}
        {active === "cart" && (
          <div className="cart-section">
            <h2>My Cart</h2>
            {cart.filter((c) => c.product).length === 0 ? (
              <p>No products in cart.</p>
            ) : (
              <>
                {cart
                  .filter((c) => c.product)
                  .map((c) => (
                    <div key={c._id} className="cart-item">
                      <img src={c.product?.image} alt={c.product?.name} />
                      <div className="info">
                        <h4>{c.product?.name || "Deleted Product"}</h4>
                        <p>₹{c.product?.price || 0}</p>
                        <input
                          type="number"
                          min="1"
                          value={c.quantity}
                          onChange={(e) =>
                            updateQuantity(c._id, e.target.value)
                          }
                        />
                        <button onClick={() => removeItem(c._id)}>Remove</button>
                      </div>
                    </div>
                  ))}
                <div className="cart-summary">
                  <h3>Total: ₹{totalCartPrice()}</h3>
                  <button className="place-btn" onClick={placeOrder}>
                    Place Order
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* 📦 ORDERS */}
        {active === "orders" && (
          <div className="orders-section">
            <h2>My Orders</h2>
            {orders.length === 0 ? (
              <p>No orders found.</p>
            ) : (
              orders.map((o) => (
                <div key={o._id} className="order-card">
                  <h4>Order #{o._id.slice(-5)}</h4>
                  <p>
                    Status: <b className={o.status}>{o.status}</b>
                  </p>
                  <p>Total: ₹{o.totalPrice}</p>
                  <p>
                    Items:{" "}
                    {o.products
                      .filter((p) => p.product)
                      .map((p) => p.product.name)
                      .join(", ")}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AddProduct;
