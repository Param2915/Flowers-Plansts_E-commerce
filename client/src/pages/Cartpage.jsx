import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Cartpage.css';
import { toast } from 'react-toastify';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  /* ---------------------- FETCH CART ---------------------- */
  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/auth/getcart'); // backend returns {items, subtotal}
      setCartItems(data.items);
      setTotal(data.subtotal);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error fetching cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  /* ------------------ DECREASE QUANTITY ------------------ */
  const decrementQty = async (cartItemId) => {
    if (isUpdating) return; // Prevent multiple clicks

    try {
      setIsUpdating(true);
      const response = await axios.patch('/api/auth/cart/decrement', {
        cart_item_id: cartItemId,
      });

      if (response.data && response.data.cart) {
        setCartItems(response.data.cart);
        setTotal(response.data.subtotal || 0);
      } else {
        fetchCartItems();
      }
    } catch (err) {
      console.error(err);
      toast.error('Could not update quantity');
    } finally {
      setIsUpdating(false);
    }
  };

  /* ------------------ INCREASE QUANTITY ------------------ */
  const incrementQty = async (cartItemId) => {
    if (isUpdating) return; // Prevent multiple clicks

    try {
      setIsUpdating(true);
      const cartItem = cartItems.find((item) => item.id === cartItemId);
      if (!cartItem) {
        throw new Error('Cart item not found');
      }

      const response = await axios.post('/api/auth/cart', {
        product_id: cartItem.product_id,
        arrangement: cartItem.Product.arrangement || 'bouquet',
      });

      if (response.data && response.data.cart) {
        setCartItems(response.data.cart);
        setTotal(response.data.subtotal || 0);
      } else {
        fetchCartItems();
      }
    } catch (err) {
      console.error(err);
      toast.error('Could not update quantity');
    } finally {
      setIsUpdating(false);
    }
  };

  /* ---------------------- REMOVE ---------------------- */
  const removeItem = async (id) => {
    if (isUpdating) return;

    try {
      setIsUpdating(true);
      const response = await axios.patch('/api/auth/cart/decrement', {
        cart_item_id: id,
        remove: true, // flag for full removal
      });

      if (response.data && response.data.cart) {
        setCartItems(response.data.cart);
        setTotal(response.data.subtotal || 0);
      } else {
        fetchCartItems();
      }

      toast.success('Item removed from cart');
    } catch (err) {
      console.error(err);
      toast.error('Could not remove item');
    } finally {
      setIsUpdating(false);
    }
  };

  /* ---------------------- RAZORPAY CHECKOUT ---------------------- */
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    try {
      // Call backend to create Razorpay order
      const { data: order } = await axios.post('/api/payment/create-order', {
        amount: Math.round(total * 100), // convert ₹ to paise
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // from env
        amount: order.amount,
        currency: order.currency,
        name: "Your Store Name",
        description: "Purchase from Your Store",
        order_id: order.id,
        handler: function (response) {
          toast.success("Payment successful! Payment ID: " + response.razorpay_payment_id);
          // Optionally clear cart or redirect user here
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on('payment.failed', function (response) {
        toast.error("Payment failed: " + response.error.description);
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to initiate payment");
    }
  };

  /* ---------------------- UI ---------------------- */
  if (loading) return <p>Loading...</p>;

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map(({ id, Product, quantity, price }) => (
              <div className="cart-item" key={id}>
                <img
                  src={
                    Product.image
                      ? `http://localhost:5000/${Product.image}`
                      : 'https://source.unsplash.com/100x100/?flower'
                  }
                  alt={Product.name || 'Product'}
                  className="cart-item-image"
                />
                <div className="item-details">
                  <h4>{Product.name || 'Product'}</h4>
                  <p>{Product.type && `Type: ${Product.type}`}</p>
                  <p>Price: ₹{price}</p>

                  <div className="quantity-controls">
                    <button onClick={() => decrementQty(id)} disabled={quantity === 1 || isUpdating}>
                      −
                    </button>
                    <span className="qty-display">{quantity}</span>
                    <button onClick={() => incrementQty(id)} disabled={isUpdating}>
                      +
                    </button>
                  </div>
                </div>

                <button className="remove-btn" onClick={() => removeItem(id)} disabled={isUpdating}>
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Total: ₹{total.toFixed(2)}</h3>
            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
