// frontend/pages/components/UsersManager.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import "../css/userManager.css";

const UsersManager=() =>{
  const API = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const token = localStorage.getItem("token");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get(`${API}/api/admin/users`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setUsers(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="users-manager">
      <h2>All Users</h2>
      <table className="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default UsersManager;
