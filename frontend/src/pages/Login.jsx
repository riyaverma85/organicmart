import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Swal from "sweetalert2";
import "../css/login.css";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // 🔹 redirectPath is either the page user came from or default /add-product
  const redirectPath = location.state?.from || "/add-product";

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      const res = await axios.post(
        `${API}/api/auth/login`,
        { email, password }
      );

      // ✅ Save token & user in context
      login(res.data.token, res.data.user);

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: `Welcome ${res.data.user.name}!`,
        timer: 1500,
        showConfirmButton: false,
      });

      // 🔹 Redirect admin to dashboard, normal user to redirectPath
      if (res.data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate(redirectPath, { replace: true });
      }

    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      setErr(message);

      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: message,
      });

      // 🔹 Redirect to register page if user not registered
      if (message.includes("register")) {
        navigate("/register", { state: { from: redirectPath }, replace: true });
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Login</h2>
        {err && <div className="message">{err}</div>}
        <form onSubmit={submit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <button type="submit">Login</button>
        </form>
        <div className="register-link">
          New user? <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
