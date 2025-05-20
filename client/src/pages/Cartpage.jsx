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

  useEffect(() => { fetchCartItems(); }, []);

  /* ------------------ DECREASE QUANTITY ------------------ */
  const decrementQty = async (cartItemId) => {
    if (isUpdating) return; // Prevent multiple clicks
    
    try {
      setIsUpdating(true);
      const response = await axios.patch('/api/auth/cart/decrement', { 
        cart_item_id: cartItemId 
      });
      
      // Update cart data
      if (response.data && response.data.cart) {
        setCartItems(response.data.cart);
        setTotal(response.data.subtotal || 0);
      } else {
        // Fallback to fetching cart again
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
      // We need to add to cart instead of decrementing for increasing quantity
      // Find the item in the cart to get its product_id and arrangement
      const cartItem = cartItems.find(item => item.id === cartItemId);
      if (!cartItem) {
        throw new Error('Cart item not found');
      }
      
      // Use the add to cart endpoint to increase quantity
      const response = await axios.post('/api/auth/cart', {
        product_id: cartItem.product_id,
        arrangement: cartItem.Product.arrangement || 'bouquet'
      });
      
      // Update cart data
      if (response.data && response.data.cart) {
        setCartItems(response.data.cart);
        setTotal(response.data.subtotal || 0);
      } else {
        // Fallback to fetching cart again
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
      // Keep decrementing until removed
      const response = await axios.patch('/api/auth/cart/decrement', { 
        cart_item_id: id,
        remove: true // Add a flag to indicate full removal
      });
      
      // Update cart data
      if (response.data && response.data.cart) {
        setCartItems(response.data.cart);
        setTotal(response.data.subtotal || 0);
      } else {
        // Fallback to fetching cart again
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
            {cartItems.map(({ id, Product, quantity, price, product_id }) => (
              <div className="cart-item" key={id}>
                <img
                  src={Product.image ? `http://localhost:5000/${Product.image}` : 'https://source.unsplash.com/100x100/?flower'}
                  alt={Product.name || 'Product'}
                  className="cart-item-image"
                />
                <div className="item-details">
                  <h4>{Product.name || 'Product'}</h4>
                  <p>{Product.type && `Type: ${Product.type}`}</p>
                  <p>Price: ₹{price}</p>

                  <div className="quantity-controls">
                    <button 
                      onClick={() => decrementQty(id)} 
                      disabled={quantity === 1 || isUpdating}
                    >−</button>
                    <span className="qty-display">{quantity}</span>
                    <button 
                      onClick={() => incrementQty(id)}
                      disabled={isUpdating}
                    >+</button>
                  </div>
                </div>

                <button 
                  className="remove-btn" 
                  onClick={() => removeItem(id)}
                  disabled={isUpdating}
                >Remove</button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Total: ₹{total.toFixed(2)}</h3>
            <button className="checkout-btn">Proceed to Checkout</button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;





















// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './Cartpage.css';
// import { toast } from 'react-toastify';

// const CartPage = () => {
//   const [cartItems, setCartItems] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [loading, setLoading] = useState(true);

//   /* ---------------------- FETCH CART ---------------------- */
//   const fetchCartItems = async () => {
//     try {
//       setLoading(true);
//       const { data } = await axios.get('/api/auth/getcart'); // backend returns {items, subtotal}
//       setCartItems(data.items);
//       setTotal(data.subtotal);
//     } catch (err) {
//       console.error(err);
//       toast.error(err.response?.data?.message || 'Error fetching cart');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchCartItems(); }, []);

//   /* ------------------ MODIFY QUANTITY ------------------ */
//   const changeQty = async (cartItemId, delta) => {
//     try {
//       const response = await axios.patch('/api/auth/cart/decrement', { cart_item_id: cartItemId, delta });
//       // Use the updated cart data from the response to update state directly
//       if (response.data && response.data.cart) {
//         setCartItems(response.data.cart);
//         setTotal(response.data.subtotal || 0);
//       } else {
//         // Fallback to fetching cart again if response doesn't include the data
//         fetchCartItems();
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error('Could not update quantity');
//     }
//   };

//   /* ---------------------- REMOVE ---------------------- */
//   const removeItem = (id) => changeQty(id, -9999); // decrement until removed

//   /* ---------------------- UI ---------------------- */
//   if (loading) return <p>Loading...</p>;

//   return (
//     <div className="cart-container">
//       <h2>Your Cart</h2>

//       {cartItems.length === 0 ? (
//         <p>Your cart is empty.</p>
//       ) : (
//         <>
//           <div className="cart-items">
//             {cartItems.map(({ id, Product, quantity, price }) => (
//               <div className="cart-item" key={id}>
//                 <img
//                   src={Product.image ? `http://localhost:5000/${Product.image}` : 'https://source.unsplash.com/100x100/?flower'}
//                   alt={Product.name || 'Product'}
//                   className="cart-item-image"
//                 />
//                 <div className="item-details">
//                   <h4>{Product.name || 'Product'}</h4>
//                   <p>{Product.type && `Type: ${Product.type}`}</p>
//                   <p>Price: ₹{price}</p>

//                   <div className="quantity-controls">
//                     <button onClick={() => changeQty(id, -1)} disabled={quantity === 1}>−</button>
//                     <span className="qty-display">{quantity}</span>
//                     <button onClick={() => changeQty(id, +1)}>+</button>
//                   </div>
//                 </div>

//                 <button className="remove-btn" onClick={() => removeItem(id)}>Remove</button>
//               </div>
//             ))}
//           </div>

//           <div className="cart-summary">
//             <h3>Total: ₹{total.toFixed(2)}</h3>
//             <button className="checkout-btn">Proceed to Checkout</button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default CartPage;


