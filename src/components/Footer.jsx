import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="cafe-footer">
      <div className="footer-glow-border" aria-hidden="true"></div>

      <div className="footer-container">
        {/* Brand Section */}
        <div className="footer-section footer-brand">
          <h3 className="footer-logo">Royal Cafe</h3>
          <p className="footer-about">
            Crafting premium beverages and culinary delights with authentic Indian flavors. Every cup tells a story of tradition and excellence.
          </p>
          <div className="social-icons">
            <a href="#" aria-label="Facebook" className="social-link"><FaFacebook /></a>
            <a href="#" aria-label="Instagram" className="social-link"><FaInstagram /></a>
            <a href="#" aria-label="Twitter" className="social-link"><FaTwitter /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-links">
            <li><a href="/">Home</a></li>
            <li><a href="/products">Menu</a></li>
            <li><a href="/cart">My Cart</a></li>
            <li><a href="/orders">My Orders</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h4 className="footer-heading">Contact Us</h4>
          <ul className="contact-info">
            <li>
              <FaMapMarkerAlt className="contact-icon" />
              <span>Royal Cafe, MG Road, Connaught Place, New Delhi - 110001</span>
            </li>
            <li>
              <FaPhone className="contact-icon" />
              <span>+91 11 4567 8900</span>
            </li>
            <li>
              <FaEnvelope className="contact-icon" />
              <span>hello@royalcafe.in</span>
            </li>
          </ul>
        </div>

        {/* Hours */}
        <div className="footer-section">
          <h4 className="footer-heading">Opening Hours</h4>
          <ul className="opening-hours">
            <li>
              <span className="day">Monday – Friday</span>
              <span className="time">7 am – 8 pm</span>
            </li>
            <li>
              <span className="day">Saturday</span>
              <span className="time">8 am – 9 pm</span>
            </li>
            <li>
              <span className="day">Sunday</span>
              <span className="time">8 am – 6 pm</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Royal Cafe. All rights reserved.</p>
      </div>
    </footer>
  );
}