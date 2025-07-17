import React, { useState } from "react";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../App";
import axios from "axios";
import "./Cart.css"; // Create this CSS file

export default function Cart() {
  const { user, cart, setCart } = useContext(AppContext);
  const [orderValue, setOrderValue] = useState(0);
  const [error, setError] = useState();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const increment = (id) => {
    const updatedCart = cart.map((product) =>
      product._id === id ? { ...product,qty: product.qty + 1 } : product
    );
    setCart(updatedCart);
  };

  const decrement = (id, qty) => {
    if (qty > 1) {
      const updatedCart = cart.map((product) =>
        product._id === id ? { ...product, qty: qty - 1 } : product
      );
      setCart(updatedCart);
    }
  };

  useEffect(() => {
    setOrderValue(
      cart.reduce((sum, value) => {
        return sum + value.qty * value.price;
      }, 0)
    );
  }, [cart]);

  const placeOrder = async () => {
    try {
      const url = `${API_URL}/api/orders`;
      const newOrder = {
        userId: user._id,
        email: user.email,
        orderValue,
        items: cart,
      };
      const result = await axios.post(url, newOrder);
      setCart([]);
      navigate("/order");
    } catch (err) {
      console.log(err);
      setError("Something went wrong");
    }
  };

  return (
    <div className="cart-container">
      <h2 className="cart-title">My Cart</h2>
      {error && <div className="error-message">{error}</div>}
      
      {cart.length === 0 ? (
        <div className="empty-cart">
          <img src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png" alt="Empty cart" />
          <p>Your cart is empty</p>
          <button className="continue-shopping" onClick={() => navigate("/")}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <ul className="cart-items">
            {cart.map(
              (value) =>
                value.qty > 0 && (
                  <li key={value._id} className="cart-item">
                    <img src={value.imgUrl} alt={value.productName} className="item-image" />
                    <div className="item-details">
                      <h3>{value.productName}</h3>
                      <p className="item-price">${value.price.toFixed(2)}</p>
                    </div>
                    <div className="quantity-controls">
                      <button 
                        onClick={() => decrement(value._id, value.qty)}
                        className="quantity-btn"
                      >
                        −
                      </button>
                      <span className="quantity">{value.qty}</span>
                      <button 
                        onClick={() => increment(value._id, value.qty)}
                        className="quantity-btn"
                      >
                        +
                      </button>
                    </div>
                    <div className="item-total">
                      ${(value.price * value.qty).toFixed(2)}
                    </div>
                  </li>
                )
            )}
          </ul>
          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${orderValue.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>FREE</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${orderValue.toFixed(2)}</span>
            </div>
            {user?.token ? (
              <button className="place-order-btn" onClick={placeOrder}>
                Place Order
              </button>
            ) : (
              <button 
                className="login-to-order-btn" 
                onClick={() => navigate("/login")}
              >
                Login to Place Order
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}