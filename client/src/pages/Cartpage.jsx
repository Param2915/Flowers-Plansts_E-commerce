import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Cartpage.css';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Assuming you have the userId from your authentication state (localStorage, context, etc.)
  const userId = localStorage.getItem('userId');  // Ensure this is set after login

  useEffect(() => {
    if (userId) {
      fetchCartItems();
    }
  }, [userId]);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/auth/getshoppingcart`, {
        params: { user_id: userId },
      });
      setCartItems(res.data);

      // Calculate total amount
      const totalAmount = res.data.reduce((sum, item) => sum + item.price * item.quantity, 0);
      setTotal(totalAmount);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError('Error fetching cart items.');
      console.error('Error fetching cart items:', error);
    }
  };

  const removeItem = async (itemId) => {
    try {
      await axios.delete(`http://localhost:5000/api/auth/deleteshoppingcart`, {
        data: { shoppingCartId: itemId, user_id: userId },
      });
      fetchCartItems();  // Refresh the cart after removing the item
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;  // Prevent negative quantity

    try {
      await axios.put(`http://localhost:5000/api/auth/deleteshoppingcart`, {
        shoppingCartId: itemId,
        user_id: userId,
        quantity: newQuantity,
      });
      fetchCartItems();  // Refresh the cart after updating quantity
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

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
                <img src={item.Product.image || 'https://source.unsplash.com/100x100/?flower'} alt={item.Product.arrangement} />
                <div className="item-details">
                  <h4>{item.Product.arrangement}</h4>
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
