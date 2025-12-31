// frontend/pages/components/DashboardHome.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/dashboard.css";

const DashboardHome = () => {
  const API = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    contacts: 0, // ✅ Contact messages count
  });
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="stats-cards">
      <div className="card">
        <h3>Total Users</h3>
        <p>{stats.users}</p>
      </div>

      <div className="card">
        <h3>Total Products</h3>
        <p>{stats.products}</p>
      </div>

      <div className="card">
        <h3>Total Orders</h3>
        <p>{stats.orders}</p>
      </div>

      {/* ✅ Contact Messages Card — clickable */}
      <div
        className="card clickable">
        <h3>Contact Messages</h3>
        <p>{stats.contacts}</p>
      </div>
    </div>
  );
};

export default DashboardHome;
