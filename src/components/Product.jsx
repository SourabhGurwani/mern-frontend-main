import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { AppContext } from "../App";
import "./Product.css";

export default function Product() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [products, setProducts] = useState([]);
  const [error, setError] = useState();
  const { user, cart, setCart } = useContext(AppContext);
  const productsRef = useRef(null);

  const fetchProducts = async () => {
    try {
      const url = `${API_URL}/api/products/all`;
      const result = await axios.get(url);
      setProducts(result.data.products);
    } catch (err) {
      console.log(err);
      setError("Something went wrong");
    }
  };

  useEffect(() => {
 
  }, []);

  const addToCart = (product) => {
    const found = cart.find((item) => item._id === product._id);
    if (!found) {
      product.qty = 1;
      setCart([...cart, product]);
    }
  };

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
 

  return (
    <div className="product-page">



      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="banner-overlay">
          <div className="banner-content">
            <h1>Artisan Coffee Experience</h1>
            <p>Discover our premium selection of handcrafted blends</p>
            <button className="explore-btn" onClick={scrollToProducts}>
              Explore Menu
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="product-grid-container" ref={productsRef}>
        <h2 className="section-title">Our Coffee Selection</h2>
        <div className="product-grid">
          {products && products.map((product) => (
            <div key={product._id} className="product-card">
              <div className="product-badge">
                {product.stock < 5 && <span className="badge">Almost Gone!</span>}
              </div>
              <img 
                src={product.imgUrl} 
                className="product-image"
                alt={product.productName}
              />
              <div className="product-info">
                <h3>{product.productName}</h3>
                <p className="product-desc">{product.description}</p>
                <div className="product-footer">
                  <span className="price">${product.price}</span>
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

      </div>

      
    </div>
  );
}