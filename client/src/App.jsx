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
import { AdminProvider } from './context/AdminContext';
import './styles.css';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ✅ Import Admin Components
import Dashboard from './components/Admin/Dashboard';
import AddProduct from './components/Admin/AddProduct';
import AllProducts from './components/Admin/AllProducts';
import EditProduct from './components/Admin/EditProduct';
import AdminRoute from './components/Admin/AdminRoute';
import DeleteProduct from './components/Admin/DeleteProduct';
import UpdateProduct from './components/Admin/UpdateProduct';
import ProductByType from './components/Admin/ProductByType';
import ProductSales from './components/Admin/ProductSales';
import ViewUsers from './components/Admin/ViewUsers';

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
        <Route path="/admin/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
        <Route path="/admin/add-product" element={<AdminRoute><AddProduct /></AdminRoute>} />
        <Route path="/admin/products" element={<AdminRoute><AllProducts /></AdminRoute>} />
        <Route path="/admin/edit-product/:id" element={<AdminRoute><EditProduct /></AdminRoute>} />
        <Route path="/admin/delete-product/:id" element={<AdminRoute><DeleteProduct /></AdminRoute>} />
        <Route path="/admin/update-product/:id" element={<AdminRoute><UpdateProduct /></AdminRoute>} />
        <Route path="/admin/products-by-type/:type" element={<AdminRoute><ProductByType /></AdminRoute>} />
        <Route path="/admin/product-sales" element={<AdminRoute><ProductSales /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><ViewUsers /></AdminRoute>} />
      </Routes>
    </Router>
  );
};

const MainApp = () => (
  <AuthProvider>
    <AdminProvider>
      <App />
    </AdminProvider>
  </AuthProvider>
);

export default MainApp;
