import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../App";
import { FaCheck, FaTimes, FaChevronLeft, FaChevronRight, FaSpinner } from "react-icons/fa";
import "./Orders.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState("Pending");
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AppContext);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const url = `${API_URL}/api/orders/?page=${page}&limit=${limit}&status=${status}`;
      const result = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setOrders(result.data.orders);
      setTotalPages(result.data.totalPages || 1);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [status, page, limit]);

  const updateOrder = async (newStatus, id) => {
    if (!window.confirm(`Are you sure you want to mark this order as ${newStatus}?`)) return;
    
    try {
      setLoading(true);
      const url = `${API_URL}/api/orders/${id}`;
      await axios.patch(url, { status: newStatus }, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setSuccess(`Order marked as ${newStatus} successfully`);
      setTimeout(() => setSuccess(""), 3000);
      fetchOrders();
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to update order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="orders-container">
      <h1 className="orders-header">Order Management</h1>
      
      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      <div className="filters">
        <select 
          className="filter-select"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Orders</option>
          <option value="Pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select 
          value={limit} 
          onChange={(e) => setLimit(Number(e.target.value))}
          className="filter-select"
        >
          <option value="5">5 per page</option>
          <option value="10">10 per page</option>
          <option value="20">20 per page</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">
          <FaSpinner className="spinner" />
          Loading orders...
        </div>
      ) : (
        <div className="orders-list">
          {orders.length === 0 ? (
            <div className="empty-orders">
              <img src="https://cdn-icons-png.flaticon.com/512/4555/4555971.png" alt="No orders" />
              <p>No orders found</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <span className="order-id">Order #{order._id.slice(-6).toUpperCase()}</span>
                  <span className={`status-badge ${order.status}`}>
                    {order.status}
                  </span>
                </div>
                <div className="order-details">
                  <div className="detail-row">
                    <span>Customer:</span>
                    <span>{order.user?.name || 'N/A'}</span>
                  </div>
                  <div className="detail-row">
                    <span>Items:</span>
                    <span>{order.items?.length || 0}</span>
                  </div>
                  <div className="detail-row">
                    <span>Total:</span>
                    <span className="order-value">${order.orderValue?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="detail-row">
                    <span>Date:</span>
                    <span>{new Date(order.createdAt).toLocaleString()}</span>
                  </div>
                  
                  {order.status === "Pending" && (
                    <div className="action-buttons">
                      <button 
                        className="btn complete"
                        onClick={() => updateOrder("completed", order._id)}
                      >
                        <FaCheck /> Complete
                      </button>
                      <button 
                        className="btn cancel"
                        onClick={() => updateOrder("cancelled", order._id)}
                      >
                        <FaTimes /> Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <div className="pagination">
        <button
          className="pagination-btn"
          disabled={page === 1 || loading}
          onClick={() => setPage(page - 1)}
        >
          <FaChevronLeft /> Previous
        </button>
        <span className="page-info">Page {page} of {totalPages}</span>
        <button
          className="pagination-btn"
          disabled={page === totalPages || totalPages === 0 || loading}
          onClick={() => setPage(page + 1)}
        >
          Next <FaChevronRight />
        </button>
      </div>
    </div>
  );
}