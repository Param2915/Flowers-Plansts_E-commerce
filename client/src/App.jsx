import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Cart from './components/Cart';
import { AuthProvider, useAuth } from './context/AuthContext';
import './styles.css';


const App = () => {
  const { user } = useAuth();

  const addToCart = async (product) => {
    if (!user) {
      alert('Please log in to add items to your cart.');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/auth/addproduct', {
        user_id: user.id,
        product_id: product.id,
        arrangement: product.arrangement,
        price: product.price,
      });
      alert('Product added to cart!');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home addToCart={addToCart} />} />
        <Route path="/products" element={<Products addToCart={addToCart} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/cart" element={<Cart userId={user ? user.id : null} />} />
      </Routes>
    </Router>
  );
};

const MainApp = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default MainApp;