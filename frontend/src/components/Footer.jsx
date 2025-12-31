import { FaFacebook, FaInstagram, FaTwitterSquare } from "react-icons/fa";
import { IoLogoYoutube } from "react-icons/io";
import "../css/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand Info */}
        <div className="footer-section">
          <h3>🌿 OrganicMart</h3>
          <p>Pure, Fresh & Healthy Organic Products — delivered to your doorstep.</p>
          <p className="address">
            📍 45 Green Valley, Mumbai, India <br />
            📞 +91 98765 43210 <br />
            ✉️ support@organicmart.com
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#shop">Shop</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="#policy">Privacy Policy</a></li>
            <li><a href="#faq">FAQ</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="footer-section newsletter">
          <h4>Stay Updated</h4>
          <p>Subscribe to get special offers, free giveaways, and more!</p>
          <form>
            <input type="email" placeholder="Enter your email" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>

        {/* Social Links */}
        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="#"><FaFacebook /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaTwitterSquare /></a>
            <a href="#"><IoLogoYoutube /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 OrganicMart | All Rights Reserved 🌱</p>
      </div>
    </footer>
  );
};

export default Footer;
