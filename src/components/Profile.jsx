import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../App";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaSignOutAlt, FaSave } from "react-icons/fa";
import "./Profile.css";

export default function Profile() {
  const [profile, setProfile] = useState({});
  const { user, setUser } = useContext(AppContext);
  const [form, setForm] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const url = `${API_URL}/api/users/${user.id}/profile`;
      const result = await axios.get(url);
      setProfile(result.data);
      // Initialize form with current profile data
      setForm({
        firstName: result.data.firstName || '',
        lastName: result.data.lastName || '',
        email: result.data.email || '',
        phone: result.data.phone || '',
        password: ''
      });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [user]);

  const logout = () => {
    setUser({});
    navigate("/");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);
      const url = `${API_URL}/api/users/${user._id}/profile`;
      await axios.post(url, form);
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(null), 3000);
      fetchProfile(); // Refresh profile data
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-title">
          <FaUser className="profile-icon" /> My Profile
        </h2>
        
        {error && <div className="alert error">{error}</div>}
        {success && <div className="alert success">{success}</div>}

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="input-group">
            <label>First Name</label>
            <div className="input-field">
              <FaUser className="input-icon" />
              <input
                name="firstName"
                type="text"
                value={form.firstName || ''}
                onChange={handleChange}
                placeholder="First Name"
              />
            </div>
          </div>

          <div className="input-group">
            <label>Last Name</label>
            <div className="input-field">
              <FaUser className="input-icon" />
              <input
                name="lastName"
                type="text"
                value={form.lastName || ''}
                onChange={handleChange}
                placeholder="Last Name"
              />
            </div>
          </div>

          <div className="input-group">
            <label>Email</label>
            <div className="input-field">
              <FaEnvelope className="input-icon" />
              <input
                name="email"
                type="email"
                value={form.email || ''}
                onChange={handleChange}
                placeholder="Email Address"
              />
            </div>

             
            <label>Phone</label>
            <div className="input-field">
              <FaEnvelope className="input-icon" />
              <input
                name="phone"
                type="text"
                value={form.phone || ''}
                onChange={handleChange}
                placeholder="Enter phone "
              />
            </div>
          </div>

          <div className="input-group">
            <label>New Password (leave blank to keep current)</label>
            <div className="input-field">
              <FaLock className="input-icon" />
              <input
                name="password"
                type="password"
                value={form.password || ''}
                onChange={handleChange}
                placeholder="New Password"
              />
            </div>
          </div>

          <div className="profile-actions">
            <button type="submit" className="btn-save" disabled={isLoading}>
              <FaSave /> {isLoading ? 'Updating...' : 'Update Profile'}
            </button>
            <button type="button" className="btn-logout" onClick={logout}>
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}