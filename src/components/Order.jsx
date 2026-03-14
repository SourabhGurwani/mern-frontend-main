import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../App";
import "./Order.css";

export default function Order() {

  const API_URL = import.meta.env.VITE_API_URL;
  const { user } = useContext(AppContext);

  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {

      setLoading(true);

      const url = `${API_URL}/api/orders/${user.email}`;

      const result = await axios.get(url);

      setOrders(result.data || []);

    } catch (err) {

      console.log(err);
      setError("Failed to load orders");

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    if (user?.email) {
      fetchOrders();
    } else {
      setLoading(false);
    }

  }, [user]);

  const getStatusColor = (status) => {

    if (!status) return "#9E9E9E";

    switch (status.toLowerCase()) {

      case "completed":
        return "#4CAF50";

      case "processing":
        return "#FFC107";

      case "cancelled":
        return "#F44336";

      default:
        return "#9E9E9E";

    }

  };

  return (

    <div className="order-container">

      <h2 className="order-title">My Orders</h2>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Loading State */}

      {loading && (
        <div className="loading-orders">
          <p>Loading your orders...</p>
        </div>
      )}

      {/* Not Logged In */}

      {!loading && !user?.email && (

        <div className="login-prompt">

          <img
            src="https://cdn-icons-png.flaticon.com/512/1828/1828466.png"
            alt="Login required"
            loading="lazy"
          />

          <p>Please login to view your orders</p>

        </div>

      )}

      {/* Empty Orders */}

      {!loading && user?.email && orders.length === 0 && (

        <div className="empty-orders">

          <img
            src="https://cdn-icons-png.flaticon.com/512/4555/4555971.png"
            alt="No orders"
            loading="lazy"
          />

          <h3>No Orders Yet</h3>

          <p>You haven't placed any orders yet</p>

        </div>

      )}

      {/* Orders List */}

      {!loading && orders.length > 0 && (

        <div className="order-list">

          {orders.map((order) => (

            <div key={order._id} className="order-card">

              <div className="order-header">

                <div className="order-meta">

                  <span className="order-id">
                    Order #{order._id.slice(-6).toUpperCase()}
                  </span>

                  <span className="order-date">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>

                </div>

                <div className="order-summary">

                  <span className="order-value">
                    ${order.orderValue.toFixed(2)}
                  </span>

                  <span
                    className="order-status"
                    style={{
                      backgroundColor: getStatusColor(order.status),
                    }}
                  >
                    {order.status}
                  </span>

                </div>

              </div>

              <div className="order-details">

                <table className="order-table">

                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                    </tr>
                  </thead>

                  <tbody>

                    {order.items.map((item) => (

                      <tr key={item._id}>

                        <td>{item.productName}</td>

                        <td>${item.price.toFixed(2)}</td>

                        <td>{item.qty}</td>

                        <td>
                          ${(item.qty * item.price).toFixed(2)}
                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );

}