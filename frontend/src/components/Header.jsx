import { useContext, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { FaCartArrowDown } from "react-icons/fa";
import { IoPersonCircle } from "react-icons/io5";
import logo from "../images/logo2.jpg";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import "../css/header.css";

const Header = () => {
  const { auth, logout, cartCount, setCartCount } = useContext(AuthContext);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(""); // new category state
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // Fetch cart count
  const fetchCartCount = async () => {
    if (!auth?.token) return;
    try {
      const res = await axios.get(`${API}/api/cart/my`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setCartCount(res.data?.items?.length || 0);
    } catch (err) {
      console.error("Cart fetch failed", err);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, [auth]);

  // Search handler with auto-suggest
  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearch(query);

    if (query.trim() === "") {
      setResults([]);
      return;
    }

    try {
      const res = await axios.get(`${API}/api/products`, {
        params: {
          search: query,
          category: category || undefined, // pass category if selected
        },
      });
      setResults(res.data.slice(0, 5));
    } catch (err) {
      console.error("Search failed", err);
      setResults([]);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim() !== "") {
      navigate(
        `/search?query=${encodeURIComponent(search)}${
          category ? `&category=${encodeURIComponent(category)}` : ""
        }`
      );
      setSearch("");
      setResults([]);
    }
  };

  const handleProfileClick = () => {
    if (auth && auth.user) {
      navigate(auth.user.role === "admin" ? "/admin/dashboard" : "/add-product");
    } else {
      navigate("/login");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="header shadow-sm py-2">
      <Container fluid className="d-flex align-items-center justify-content-between flex-wrap">
        {/* Logo */}
        <div
          className="d-flex align-items-center"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="logo" className="header-logo" />
          <h3 className="brand-name ms-2">OrganicMart</h3>
        </div>

        {/* Search */}
        <div className="search-wrapper position-relative d-flex align-items-center">
          <form className="search-container" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={handleSearchChange}
            />
            <button type="submit"></button>
          </form>

          {/* Category Dropdown */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="ms-2"
          >
            <option value="">All</option>
            <option value="fruits">Fruits</option>
            <option value="vegetables">Vegetables</option>
            <option value="dairy">Dairy</option>
          </select>

          {/* Auto-suggest dropdown */}
          {results.length > 0 && (
            <ul className="search-dropdown">
              {results.map((p) => (
                <li
                  key={p._id}
                  onClick={() => {
                    navigate(`/product/${p._id}`);
                    setSearch("");
                    setResults([]);
                  }}
                >
                  {p.name} - ₹{p.price}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Icons */}
        <div className="header-icons d-flex align-items-center">
          <div className="cart-icon-wrapper" onClick={() => navigate("/add-product")}>
            <FaCartArrowDown className="icon" />
            {cartCount > 0 && <span className="cart-count-badge">{cartCount}</span>}
          </div>

          {auth && auth.user ? (
            <>
              <button
                className="btn btn-link me-2"
                onClick={() =>
                  navigate(auth.user.role === "admin" ? "/admin/dashboard" : "/add-product")
                }
              >
                {auth.user.name}
              </button>
              <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <button className="btn btn-link" onClick={handleProfileClick}>
              <IoPersonCircle className="icon" />
            </button>
          )}
        </div>
      </Container>
    </header>
  );
};

export default Header;
