// frontend/pages/components/OrdersManager.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../css/orders.css"

const OrdersManager=() =>{
  const API = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const token = localStorage.getItem("token");
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await axios.get(`${API}/api/admin/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setOrders(res.data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ Update order status
  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(
        `${API}/api/admin/orders/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire("Updated!", `Order marked as ${newStatus}`, "success");
      fetchOrders();
    } catch (err) {
      Swal.fire("Error", "Failed to update order", "error");
    }
  };

  return (
    <div className="orders-manager">
      <h2>All Orders</h2>
      <table className="orders-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Products</th>
            <th>Total Price</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
  {orders.map((o) => (
    <tr key={o._id}>
      <td data-label="User">{o.user?.name || "Guest"}</td>
      <td data-label="Products">{o.products?.map((p) => p.product?.name || "Deleted Product").join(", ")}</td>
      <td data-label="Total">₹{o.totalPrice}</td>
      <td data-label="Status">{o.status}</td>
      <td data-label="Action">
        <select
          value={o.status}
          onChange={(e) => handleStatusChange(o._id, e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </td>
    </tr>
  ))}
</tbody>

      </table>
    </div>
  );
}
export default OrdersManager;
