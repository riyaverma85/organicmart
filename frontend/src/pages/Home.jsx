import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Carousel from "react-bootstrap/Carousel";

import ban1 from "../images/carousel-1.jpg";
import ban2 from "../images/carousel-2.jpg";
import ban3 from "../images/carousal.jpeg";
import Upperimage from "../images/fruits.jpg";
import hero from "../images/about.webp";
import image from "../images/blank.jpg";

// import { FaLeaf, FaSeedling, FaAppleAlt } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import ProductCard from "../components/ProductCard";
import "../css/home.css";

const API = import.meta.env.VITE_API_URL || "";

const rightContent = [
  { title: "Modern Farm", desc: "Made with passion by 300+ curators across the country." },
  { title: "Always Fresh", desc: "Eat local, consume local, closer to nature." },
  { title: "Sustainable", desc: "Chemical-free consumption IN and OUT." },
];
const leftContent = [
  { title: "Handmade", desc: "Made with passion by 300+ curators across the country." },
  { title: "100% Natural", desc: "Eat local, consume local, closer to nature." },
  { title: "Curated Products", desc: "Eat local, consume local, closer to nature." },
];

const Home = () => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [hoverSide, setHoverSide] = useState(null);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API}/api/products`);
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Add to cart
  const handleAddToCart = async (product) => {
    try {
      const token = auth?.token || localStorage.getItem("token");
      if (!token) {
        Swal.fire("Please login to add items to cart");
        navigate("/login");
        return;
      }

      await axios.post(
        `${API}/api/cart/add`,
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire({
        icon: "success",
        title: "Added!",
        text: "Product added to cart successfully!",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      Swal.fire(err.response?.data?.message || "Failed to add to cart");
    }
  };

  // Generic button click handler (carousel / sections)
  const handleShopClick = () => {
    const token = auth?.token || localStorage.getItem("token");
    if (!token) {
      Swal.fire("Please login to start shopping!");
      navigate("/login");
    } else {
      navigate("/add-product");
    }
  };

  const handleMouseEnter = (side, index) => {
    setHoverSide(side);
    setHoverIndex(index);
  };
  const handleMouseLeave = () => {
    setHoverSide(null);
    setHoverIndex(null);
  };

  return (
    <>
      {/* Carousel Section */}
      <section className="organic-carousel">
        <Carousel fade interval={4000} controls={true}>
          {[{img: ban1, title:"Fresh Organic Vegetables", desc:"Eat healthy, live healthy — fresh, local, and chemical-free produce straight from farms.", btn:"Shop Now"},
            {img: ban2, title:"100% Natural & Chemical-Free", desc:"Pure and eco-friendly products grown with love — just the way nature intended.", btn:"Explore More"},
            {img: ban3, title:"Healthy Lifestyle Starts Here", desc:"Make the switch to organic — nourish your body, care for the planet.", btn:"Get Started"}].map((slide, idx) => (
              <Carousel.Item key={idx}>
                <img className="carousel-image" src={slide.img} alt={slide.title} />
                <div className="carousel-overlay"></div>
                <div className="carousel-caption-left">
                  <h1>{slide.title}</h1>
                  <p>{slide.desc}</p>
                  <button className="carousel-btn" onClick={handleShopClick}>{slide.btn}</button>
                </div>
              </Carousel.Item>
          ))}
        </Carousel>
      </section>

      {/* Products Grid */}
      <section className="products-section">
        <div className="container">
          <h2>Shop Products</h2>
          {loading ? <p>Loading products...</p> : (
            <div className="products-grid">
              {products.map(p => <ProductCard key={p._id} product={p} onAdd={handleAddToCart} />)}
            </div>
          )}
        </div>
      </section>

      {/* Upper Section */}
      <section className="organic-upper">
        <div className="upper-container">
          <div className="upper-text">
            <h2>🌱 Best Organic Fruits & Vegetables</h2>
            <p>Discover the freshest, locally grown fruits and vegetables, carefully hand-picked and delivered straight to your doorstep — because you deserve better health.</p>
            <ul className="organic-list">
              <li>✔️ Fresh from organic farms</li>
              <li>✔️ Hand-picked with care</li>
              <li>✔️ Eco-friendly packaging</li>
            </ul>
            <button className="btnn2" onClick={handleShopClick}>Read More</button>
          </div>
          <div className="upper-image">
            <img src={Upperimage} alt="Organic Vegetables" />
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Pure • Natural • Healthy Living 🌿</h1>
          <p>Discover the freshness of organic life — where every product is grown with love and care for you and the planet.</p>
          <button onClick={handleShopClick}>Shop Organic</button>
        </div>
        <div className="hero-imagee">
          <img src={hero} alt="web" />
        </div>
      </section>

      {/* Farm Section */}
      <section className="farm">
        <div className="farm-content">
          <h2>Fresh from the Farm</h2>
          <p>Taste the difference of truly fresh produce — handpicked and delivered at peak freshness.</p>
          <button onClick={handleShopClick}>Explore More</button>
        </div>
      </section>

      {/* Left & Right Section */}
      <div className="container">
        <div className="side left">
          {leftContent.map((item, idx) => (
            <div key={idx} className="content-block" onMouseEnter={() => handleMouseEnter("left", idx)} onMouseLeave={handleMouseLeave}>
              <div className="hover-icon">{hoverSide==="left" && hoverIndex===idx && <span className="dot"></span>}</div>
              <div><h3>{item.title}</h3><p>{item.desc}</p></div>
            </div>
          ))}
        </div>

        <div className="image-wrapper">
          <img src={image} alt="Healthy Food" />
          <div className="circle-text"><h2>Wholesome Goodness</h2><p>Naturally Curated</p></div>
        </div>

        <div className="side right">
          {rightContent.map((item, idx) => (
            <div key={idx} className="content-block" onMouseEnter={() => handleMouseEnter("right", idx)} onMouseLeave={handleMouseLeave}>
              <div><h3>{item.title}</h3><p>{item.desc}</p></div>
              <div className="hover-icon">{hoverSide==="right" && hoverIndex===idx && <span className="dot"></span>}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
