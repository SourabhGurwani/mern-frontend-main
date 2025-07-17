import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="cafe-footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-logo">Brew Haven</h3>
          <p className="footer-about">
            Artisanal coffee and homemade pastries crafted with love since 2010.
          </p>
          <div className="social-icons">
            <a href="#" aria-label="Facebook"><FaFacebook /></a>
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><a href="/">Home</a></li>
            <li><a href="/products">Menu</a></li>
            <li><a href="/cart">My Cart</a></li>
            <li><a href="/orders">My Orders</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact Us</h4>
          <ul className="contact-info">
            <li><FaMapMarkerAlt /> Near Green Valley , Law-Gate ,Phagwara </li>
            <li><FaPhone /> +91-9109494579</li>
            <li><FaEnvelope /> sonusourabh2411@admin.com</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Opening Hours</h4>
          <ul className="opening-hours">
            <li>Monday - Friday: 7am - 8pm</li>
            <li>Saturday: 8am - 9pm</li>
            <li>Sunday: 8am - 6pm</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} SG Brews. All rights reserved.</p>
      </div>
    </footer>
  );
}