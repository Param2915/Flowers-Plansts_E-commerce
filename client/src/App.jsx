import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import CartPage from './pages/Cartpage';
import About from './pages/About';
import Contact from './pages/Contact';
import { AuthProvider, useAuth } from './context/AuthContext';
import './styles.css';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ✅ Import Admin Components
import AdminLogin from './components/Admin/AdminLogin';
import Dashboard from './components/Admin/Dashboard';
import AddProduct from './components/Admin/AddProduct';
import AllProducts from './components/Admin/AllProducts';
import EditProduct from './components/Admin/EditProduct';
import AdminRoute from './components/Admin/AdminRoute';

const App = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        setProducts(res.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const addToCart = async (product) => {
    if (!user) {
      alert('Please log in to add items to your cart.');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/products/cart/add', {
        user_id: user.id,
        product_id: product.id,
        arrangement: product.arrangement,
        price: product.price,
        quantity: 1,
        image: product.image,
      });
      toast.success('Product added to cart!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to add to cart.');
    }
  };

  return (
    <Router>
      <Navbar />
      <ToastContainer />
      <Routes>
        {/* 🌸 User Side Routes */}
        <Route path="/" element={<Home products={products} addToCart={addToCart} />} />
        <Route path="/products" element={<Products addToCart={addToCart} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/cart" element={<CartPage userId={user ? user.id : null} />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* 🔐 Admin Panel Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
        <Route path="/admin/add-product" element={<AdminRoute><AddProduct /></AdminRoute>} />
        <Route path="/admin/products" element={<AdminRoute><AllProducts /></AdminRoute>} />
        <Route path="/admin/edit-product/:id" element={<AdminRoute><EditProduct /></AdminRoute>} />
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
