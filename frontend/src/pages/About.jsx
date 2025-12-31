import "../css/about.css";
import aboutbanner from "../images/aboutbanner.jpeg";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";

const About = () => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleShopClick = () => {
    const token = auth?.token || localStorage.getItem("token");
    if (!token) {
      Swal.fire("Please login to shop!");
      navigate("/login");
    } else {
      navigate("/add-product"); // or /shop route if you have one
    }
  };

  return (
    <section className="about-section">
      <div className="containerr">
        {/* Header Section */}
        <div className="about-header">
          <h1>🌿 About OrganicMart</h1>
          <p>
            At OrganicMart, we believe in a healthier lifestyle for you and a greener planet. We bring 100% organic, chemical-free products straight from trusted local farms to your home.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="about-mission-vision">
          <div className="about-card">
            <h2>Our Mission</h2>
            <p>
              To make organic living accessible and enjoyable by providing high-quality, fresh, and sustainable products directly from local farmers.
            </p>
          </div>
          <div className="about-card">
            <h2>Our Vision</h2>
            <p>
              To create a healthier world where people choose sustainable, eco-friendly, and nutritious products for themselves and future generations.
            </p>
          </div>
          <div className="about-card">
            <h2>Our Values</h2>
            <p>
              Sustainability, transparency, quality, and trust. We prioritize our customers’ health and the environment above all.
            </p>
          </div>
        </div>

        {/* Image + Description */}
        <div className="about-content">
          <div className="about-text">
            <h2>Why Choose OrganicMart?</h2>
            <p>
              We carefully select our products from certified organic farms. Every fruit, vegetable, herb, and wellness product you receive is fresh, safe, and eco-friendly. Our farmers follow sustainable practices, reducing chemical usage and protecting the planet. 
            </p>
            <p>
              With OrganicMart, you get transparency, convenience, and a commitment to health. Join our community and experience the difference of real organic living.
            </p>
            <button className="about-btn" onClick={handleShopClick}>Shop Organic Now</button>
          </div>
          <div className="about-image">
            <img 
              src={aboutbanner} 
              alt="Organic Products"
            />
          </div>
        </div>

        {/* Statistics Section */}
        <div className="about-stats">
          <div className="stat-card">
            <h3>500+</h3>
            <p>Organic Products</p>
          </div>
          <div className="stat-card">
            <h3>100+</h3>
            <p>Trusted Farms</p>
          </div>
          <div className="stat-card">
            <h3>10k+</h3>
            <p>Happy Customers</p>
          </div>
          <div className="stat-card">
            <h3>24/7</h3>
            <p>Support</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
