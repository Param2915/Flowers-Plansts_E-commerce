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
import AdminLogin from './components/Admin/AdminLogin';
import Dashboard from './components/Admin/Dashboard';
import AddProduct from './components/Admin/AddProduct';
import AllProducts from './components/Admin/AllProducts';
import EditProduct from './components/Admin/EditProduct';
import AdminRoute from './components/Admin/AdminRoute';

axios.defaults.baseURL = 'http://localhost:5000';            
axios.interceptors.request.use((config) => {                 
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const AppCore = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        setProducts(data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load products');
      }
    };
    fetchProducts();
  }, []);

  /* ----------------------- ADD‑TO‑CART ----------------------- */
  const addToCart = async (product) => {
    if (!user) {
      toast.info('Please log in to add items to your cart.');
      return;
    }

    try {
      await axios.post('/api/auth/cart', {
        product_id: product.id,
        arrangement: product.arrangement,
      });
      toast.success('Product added to cart!');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to add to cart.');
    }
  };

  return (
    <Router>
      <Navbar />
      <ToastContainer position="top-right" autoClose={2500} />
      <Routes>
        <Route path="/" element={<Home products={products} addToCart={addToCart} />} />
        <Route path="/products" element={<Products addToCart={addToCart} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/cart" element={<CartPage userId={user ? user.id : null} />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />  {/* ✅ Contact route added */}

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
    <AppCore />
  </AuthProvider>
);

export default MainApp;




