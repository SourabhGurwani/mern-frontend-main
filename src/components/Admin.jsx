import React from "react";
import { Outlet, Link } from "react-router-dom";
import "./Admin.css"; // Import the CSS file

export default function Admin() {
  return (
    <div className="admin-layout">
      <nav className="admin-nav">
        <Link to="/admin" className="nav-link">Users</Link>
        <Link to="/admin/products" className="nav-link">Products</Link>
        <Link to="/admin/orders" className="nav-link">Orders</Link>
      </nav>
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}