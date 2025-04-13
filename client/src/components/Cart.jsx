import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Cart = ({ userId }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/auth/getshoppingcart?user_id=${userId}`);
        setCartItems(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (userId) {
      fetchCartItems();
    }
  }, [userId]);

  const removeFromCart = async (itemId) => {
    try {
      await axios.delete('http://localhost:5000/api/auth/deleteshoppingcart', { data: { shoppingCartId: itemId, user_id: userId } });
      setCartItems(cartItems.filter(item => item.id !== itemId));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="cart">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cartItems.map(item => (
          <div key={item.id} className="cart-item">
            <h3>{item.product.name}</h3>
            <p>Price: ${item.price}</p>
            <button onClick={() => removeFromCart(item.id)}>Remove</button>
          </div>
        ))
      )}
    </div>
  );
};

export default Cart;