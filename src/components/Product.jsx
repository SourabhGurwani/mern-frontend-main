import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { AppContext } from "../App";
import "./Product.css";

export default function Product() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const { cart, setCart } = useContext(AppContext);

  const productsRef = useRef(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const url = `${API_URL}/api/products/all`;
      const result = await axios.get(url);
      setProducts(result.data.products || []);
    } catch (err) {
      console.log(err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, []);

  const addToCart = (product) => {
    const found = cart.find((item) => item._id === product._id);

    if (!found) {
      setCart([...cart, { ...product, qty: 1 }]);
      setMessage("Added to Cart");
    } else {
      setMessage("Already in Cart");
    }

    setTimeout(() => {
      setMessage("");
    }, 2000);
  };

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="product-page">

      {/* Success Message */}
      {message && (
        <div className="cart-message">
          {message}
        </div>
      )}

      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="banner-overlay">
          <div className="banner-content">
            <div className="hero-badge">Authentic Indian Café</div>
            <h1>Experience the Royal Taste of India</h1>
            <p>Handcrafted beverages & culinary delights, served with tradition</p>

            <button className="explore-btn" onClick={scrollToProducts}>
              Explore Menu
            </button>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="product-grid-container" ref={productsRef}>
        <h2 className="section-title">Our Curated Menu</h2>
        <div className="section-intro">
          <p>From rich masala chai to signature sweets and comfort bites, every item is crafted to feel warm, indulgent, and memorable.</p>
          <div className="feature-pills">
            <span className="feature-pill">Freshly prepared</span>
            <span className="feature-pill">Premium ingredients</span>
            <span className="feature-pill">Fast service</span>
          </div>
        </div>

        {error && <h3>{error}</h3>}

        {loading ? (
          <div className="product-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="product-card skeleton-card">
                <div className="skeleton-image"></div>
                <div className="skeleton-info">
                  <div className="skeleton-line title"></div>
                  <div className="skeleton-line desc"></div>
                  <div className="skeleton-line desc-short"></div>
                  <div className="skeleton-footer">
                    <div className="skeleton-line price"></div>
                    <div className="skeleton-line button"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product, index) => (
              <div 
                key={product._id} 
                className="product-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="product-badge">
                  {product.stock < 5 && (
                    <span className="badge">Almost Gone!</span>
                  )}
                </div>

                <div className="product-image-container">
                  <img
                    src={product.imgUrl}
                    className="product-image"
                    alt={product.productName}
                    loading="lazy"
                  />
                </div>

                <div className="product-info">
                  <h3>{product.productName}</h3>

                  <p className="product-desc">
                    {product.description}
                  </p>

                  <div className="product-footer">
                    <span className="price">
                      ₹{product.price}
                    </span>

                    <button
                      onClick={() => addToCart(product)}
                      className="cart-btn"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}