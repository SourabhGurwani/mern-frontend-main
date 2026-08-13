import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../App";
import { FaCrown } from "react-icons/fa";
import "./Header.css";

export default function Header() {
  const { user, cart } = useContext(AppContext);
  const cartCount = cart.length > 9 ? "9+" : cart.length;
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`cafe-header${scrolled ? " scrolled" : ""}`}>
      <nav className="cafe-nav">
        <Link to="/" className="cafe-logo" onClick={closeMenu}>
          <FaCrown className="logo-icon" />
          <span className="logo-text">Royal Cafe</span>
        </Link>

        <div className="nav-links">
          <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>Home</NavLink>
          <NavLink to="/cart" className={({ isActive }) => `nav-link cart-link${isActive ? " active" : ""}`}>
            My Cart
            {cart.length > 0 && <span className="cart-badge">{cartCount}</span>}
          </NavLink>
          <NavLink to="/orders" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>My Orders</NavLink>
          {user?.role === "admin" && (
            <NavLink to="/admin" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>Admin</NavLink>
          )}
          {user?.token ? (
            <NavLink to="/profile" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>Profile</NavLink>
          ) : (
            <NavLink to="/login" className="nav-link login-btn">Login</NavLink>
          )}
        </div>

        <button
          className={`hamburger-btn${menuOpen ? " active" : ""}`}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      <div className={`mobile-nav ${menuOpen ? "open" : ""}`}>
        <Link to="/" className="mobile-link" onClick={closeMenu}>Home</Link>
        <Link to="/cart" className="mobile-link" onClick={closeMenu}>
          My Cart
          {cart.length > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>
        <Link to="/orders" className="mobile-link" onClick={closeMenu}>My Orders</Link>
        {user?.role === "admin" && (
          <Link to="/admin" className="mobile-link" onClick={closeMenu}>Admin</Link>
        )}
        {user?.token ? (
          <Link to="/profile" className="mobile-link" onClick={closeMenu}>Profile</Link>
        ) : (
          <Link to="/login" className="mobile-link login-btn" onClick={closeMenu}>Login</Link>
        )}
      </div>
    </header>
  );
}
