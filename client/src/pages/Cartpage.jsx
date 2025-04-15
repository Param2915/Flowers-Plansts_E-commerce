import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Cartpage.css';

const CartPage = ({ userId }) => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (userId) {
      fetchCartItems();
    }
  }, [userId]);

  const fetchCartItems = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/products/cart/${userId}`);
      setCartItems(res.data);
      const totalAmount = res.data.reduce((sum, item) => sum + item.price * item.quantity, 0);
      setTotal(totalAmount);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const removeItem = async (itemId) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/cart/item/${itemId}`);
      fetchCartItems();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await axios.put(`http://localhost:5000/api/products/cart/item/${itemId}`, {
        quantity: newQuantity,
      });
      fetchCartItems();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div className="cart-item" key={item.id}>
                <img src={item.image || 'https://source.unsplash.com/100x100/?flower'} alt={item.arrangement} />
                <div className="item-details">
                  <h4>{item.arrangement}</h4>
                  <p>Price: ${item.price}</p>
                  <div className="quantity-controls">
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.id, parseInt(e.target.value) || 1)
                      }
                      className="quantity-input"
                    />
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button className="remove-btn" onClick={() => removeItem(item.id)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h3>Total: ${total.toFixed(2)}</h3>
            <button className="checkout-btn">Proceed to Checkout</button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
