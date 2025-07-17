import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../App";
import { FaLock, FaEnvelope } from "react-icons/fa";
import "./Login.css";

export default function Login() {
  const { setUser } = useContext(AppContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const url = `${API_URL}/api/users/login`;
      const result = await axios.post(url, formData);
      setUser(result.data);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Sign in to your SG Brews account</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            
            />
          </div>

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <p>Don't have an account? <Link to="/register">Create one</Link></p>
          <Link to="/forgot-password" className="forgot-password">Forgot Password?</Link>
        </div>
      </div>
    </div>
  );
}