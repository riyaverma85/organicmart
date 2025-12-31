import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../css/admincontacts.css";

const AdminContacts = () => {
  const API = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const token = localStorage.getItem("token");
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API}/api/contact`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch contact messages.", "error");
    }
  };

  const deleteMessage = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This message will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API}/api/contact/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          Swal.fire("Deleted!", "Message deleted successfully.", "success");
          fetchMessages();
        } catch {
          Swal.fire("Error", "Failed to delete message.", "error");
        }
      }
    });
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="admin-contact-page">
      <h2>Contact Messages</h2>
      {messages.length === 0 ? (
        <p>No contact messages found.</p>
      ) : (
        <table className="contact-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Message</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg) => (
              <tr key={msg._id}>
                <td>{msg.name}</td>
                <td>{msg.email}</td>
                <td>{msg.message}</td>
                <td>{new Date(msg.createdAt).toLocaleString()}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => deleteMessage(msg._id)}
                  >
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminContacts;
