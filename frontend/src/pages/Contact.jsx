import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../css/contact.css";

const Contact = () => {
  const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      Swal.fire("⚠️ All fields are required!");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API}/api/contact`, formData);

      if (res.data.success) {
        Swal.fire("✅ Message Sent!", "We'll reply soon. 🌿", "success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        Swal.fire("❌ Failed", res.data.message || "Something went wrong", "error");
      }
    } catch (err) {
      Swal.fire("❌ Error", "Unable to send message.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact-section">
      <div className="contact-container">
        <div className="contact-info">
          <h2>📞 Get in Touch</h2>
          <p>
            Have questions about our organic products or want to collaborate?
            We'd love to hear from you!
          </p>
          <ul>
            <li><strong>📍 Address:</strong> Green Street, Eco City, India</li>
            <li><strong>📧 Email:</strong> support@organicmart.com</li>
            <li><strong>📞 Phone:</strong> +91 98765 43210</li>
          </ul>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <h3>Send Us a Message</h3>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Message 🌱"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
