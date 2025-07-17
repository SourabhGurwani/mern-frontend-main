import React from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../App";
import "./Header.css";

export default function Header() {
  const { user, cart } = useContext(AppContext); // extracting cart from context

 
  const cartCount = cart.length > 9 ? "9+" : cart.length;

  return (
    <header className="cafe-header">
      <nav className="cafe-nav">
        <h1 className="cafe-logo">SG Brews</h1>

        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>

          <Link to="/cart" className="nav-link">
            My Cart{cart.length > 0 && ` (${cartCount})`}
          </Link>

          <Link to="/orders" className="nav-link">My Orders</Link>

          {user?.role === "admin" && (
            <Link to="/admin" className="nav-link">Admin</Link>
          )}

          {user?.token ? (
            <Link to="/profile" className="nav-link">Profile</Link>
          ) : (
            <Link to="/login" className="nav-link login-btn">Login</Link>
          )}
        </div>
      </nav>
    </header>
  );
}
