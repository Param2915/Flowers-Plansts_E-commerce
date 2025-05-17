import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";
import { toast } from "react-toastify";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/admin/login", {
        email,
        password,
      });

      localStorage.setItem("adminToken", res.data.token);
      toast.success("Admin login successful!");
      navigate("/admin/dashboard");
    } catch (err) {
      // 1) Log the full response data
      console.error("Login error response:", err.response?.data);

      // 2) Show the exact message from backend, or fallback
      const msg =
        err.response?.data?.message ||
        "Login failed. Please check your credentials.";
      toast.error(msg);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="login-card">
        <h2>🌸 Admin Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
