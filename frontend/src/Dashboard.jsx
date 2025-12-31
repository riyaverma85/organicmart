import { useState } from "react";
import DashboardHome from "./AdminComponent/DashboardHome";
import ProductManager from "./AdminComponent/ProductManager";
import OrdersManager from "./AdminComponent/OrdersManager";
import UsersManager from "./AdminComponent/UsersManager";
import AdminContact from "./AdminComponent/AdminContact"; 
import "./css/dashboard.css";

export default function AdminDashboard() {
  const [active, setActive] = useState("dashboard");

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li
            className={active === "dashboard" ? "active" : ""}
            onClick={() => setActive("dashboard")}
          >
            Dashboard
          </li>
          <li
            className={active === "products" ? "active" : ""}
            onClick={() => setActive("products")}
          >
            Products
          </li>
          <li
            className={active === "users" ? "active" : ""}
            onClick={() => setActive("users")}
          >
            Users
          </li>
          <li
            className={active === "orders" ? "active" : ""}
            onClick={() => setActive("orders")}
          >
            Orders
          </li>
          <li
            className={active === "contacts" ? "active" : ""}
            onClick={() => setActive("contacts")} >
            Contact Messages
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {active === "dashboard" && <DashboardHome />}
        {active === "products" && <ProductManager />}
        {active === "users" && <UsersManager />}
        {active === "orders" && <OrdersManager />}
        {active === "contacts" && <AdminContact />} {/* ✅ Contact page */}
      </main>
    </div>
  );
}
