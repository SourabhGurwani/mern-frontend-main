import React, { useEffect, useState, useRef, useContext } from "react";
import { AppContext } from "../App";
import axios from "axios";
import { FaSearch, FaEdit, FaTrash, FaUser, FaUserShield, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "./Users.css";

export default function Users() {
  const [users, setUsers] = useState([]);
  const { user } = useContext(AppContext);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const frmRef = useRef();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone:"",
    password: "",
    role: "",
  });
  const [page, setPage] = useState(1);
  const [searchVal, setSearchVal] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const url = `${API_URL}/api/users/?page=${page}&search=${searchVal}`;
      const result = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setUsers(result.data.users);
      setTotalPages(result.data.totalPages);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch users");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, searchVal]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    
    try {
      setIsLoading(true);
      const url = `${API_URL}/api/users/${id}`;
      await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setSuccess("User deleted successfully");
      fetchUsers();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to delete user");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!frmRef.current.checkValidity()) {
      frmRef.current.reportValidity();
      return;
    }
    
    try {
      setIsLoading(true);
      const url = `${API_URL}/api/users`;
      await axios.post(url, form, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setSuccess("User added successfully");
      fetchUsers();
      resetForm();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to add user");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditId(user._id);
    setForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone:user.phone,
      password: "",
      role: user.role,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!frmRef.current.checkValidity()) {
      frmRef.current.reportValidity();
      return;
    }
    
    try {
      setIsLoading(true);
      const url = `${API_URL}/api/users/${editId}`;
      await axios.patch(url, form, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setSuccess("User updated successfully");
      fetchUsers();
      setEditId(null);
      resetForm();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update user");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditId(null);
    resetForm();
  };

  const resetForm = () => {
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      phone:"",
      password: "",
      role: "",
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  return (
    <div className="users-container">
      <h2 className="users-title">User Management</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="user-form-container">
        <form ref={frmRef} className="user-form">
          <div className="form-row">
            <div className="input-group">
              <label>First Name</label>
              <input
                name="firstName"
                value={form.firstName}
                type="text"
                placeholder="First Name"
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="input-group">
              <label>Last Name</label>
              <input
                name="lastName"
                value={form.lastName}
                type="text"
                placeholder="Last Name"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label>Email</label>
              <input
                name="email"
                value={form.email}
                type="email"
                placeholder="Email Address"
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Phone</label>
              <input
                name="phone"
                value={form.phone}
                type="text"
                placeholder="Phone Number"
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="input-group">
              <label>Password</label>
              <input
                name="password"
                value={form.password}
                type="password"
                placeholder={editId ? "New Password (leave blank to keep current)" : "Password"}
                onChange={handleChange}
                required={!editId}
                minLength="6"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label>Role</label>
              <select
                name="role"
                value={form.role}
                required
                onChange={handleChange}
              >
                <option value="">--Select Role--</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            <div className="form-actions">
              {editId ? (
                <>
                  <button 
                    type="button" 
                    onClick={handleUpdate} 
                    className="btn-update"
                    disabled={isLoading}
                  >
                    Update
                  </button>
                  <button 
                    type="button" 
                    onClick={handleCancel} 
                    className="btn-cancel"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button 
                  type="button" 
                  onClick={handleAdd} 
                  className="btn-add"
                  disabled={isLoading}
                >
                  Add User
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      <div className="search-container">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-group">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Search users..."
            />
            <button type="submit" className="btn-search">
              Search
            </button>
          </div>
        </form>
      </div>

      <div className="users-table-container">
        {isLoading ? (
          <div className="loading">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="no-users">No users found</div>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
           <tbody>
  {users.map((value) => (
    <tr key={value._id}>
      <td>{value.firstName} {value.lastName}</td>
      <td>{value.email}</td> {/* email yaha hona chahiye */}
      <td>{value.phone}</td> {/* phone yaha hona chahiye */}
      <td>
        <span className={`role-badge ${value.role}`}>
          {value.role === 'admin' ? <FaUserShield /> : <FaUser />}
          {value.role}
        </span>
      </td>
      <td className="actions">
        <button 
          onClick={() => handleEdit(value)} 
          className="btn-edit"
        >
          <FaEdit /> Edit
        </button>
        <button 
          onClick={() => handleDelete(value._id)} 
          className="btn-delete"
        >
          <FaTrash /> Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>
          </table>
        )}
      </div>

      <div className="pagination">
        <button 
          onClick={() => setPage(page - 1)} 
          disabled={page === 1 || isLoading}
          className="btn-prev"
        >
          <FaArrowLeft /> Previous
        </button>
        
        <span className="page-info">Page {page} of {totalPages}</span>
        
        <button 
          onClick={() => setPage(page + 1)} 
          disabled={page >= totalPages || isLoading || users.length === 0}
          className="btn-next"
        >
          Next <FaArrowRight />
        </button>
      </div>
    </div>
  );
}