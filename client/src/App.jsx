

//////////////////////////////// after adding admin part and solving the dashboard issues


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
import Dashboard from './components/Admin/Dashboard';
import AddProduct from './components/Admin/AddProduct';
import AllProducts from './components/Admin/AllProducts';
import EditProduct from './components/Admin/EditProduct';
import DeleteProduct from './components/Admin/DeleteProduct';
import UpdateProduct from './components/Admin/UpdateProduct';
import ProductByType from './components/Admin/ProductByType';
import ProductSales from './components/Admin/ProductSales';
import ViewUsers from './components/Admin/ViewUsers';
import AdminRoute from './components/Admin/AdminRoute';

// Configure axios
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
      const response = await axios.post('/api/auth/cart', {
        product_id: product.id,
        arrangement: product.arrangement || 'bouquet', // Provide default if missing
      });
      
      // Use the message from the server response
      toast.success(response.data.message || 'Product added to cart!');
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
        {/* Main Routes */}
        <Route path="/" element={<Home products={products} addToCart={addToCart} />} />
        <Route path="/products" element={<Products addToCart={addToCart} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/cart" element={<CartPage userId={user ? user.id : null} />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Admin Routes - Protected by AdminRoute component */}
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
      <AppCore />
    </AdminProvider>
  </AuthProvider>
);

export default MainApp;































//////////////////////// after adding th admin part /////////////////////////////








// import React, { useEffect, useState } from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import Home from './pages/Home';
// import Products from './pages/Products';
// import Login from './components/Auth/Login';
// import Signup from './components/Auth/Signup';
// import CartPage from './pages/Cartpage';
// import About from './pages/About';
// import Contact from './pages/Contact'; 
// import { AuthProvider, useAuth } from './context/AuthContext';
// import { AdminProvider } from './context/AdminContext';
// import './styles.css';
// import axios from 'axios';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Dashboard from './components/Admin/Dashboard';
// import AddProduct from './components/Admin/AddProduct';
// import AllProducts from './components/Admin/AllProducts';
// import EditProduct from './components/Admin/EditProduct';
// import DeleteProduct from './components/Admin/DeleteProduct';
// import UpdateProduct from './components/Admin/UpdateProduct';
// import ProductByType from './components/Admin/ProductByType';
// import ProductSales from './components/Admin/ProductSales';
// import ViewUsers from './components/Admin/ViewUsers';
// import AdminRoute from './components/Admin/AdminRoute';

// // Configure axios
// axios.defaults.baseURL = 'http://localhost:5000';            
// axios.interceptors.request.use((config) => {                 
//   const token = localStorage.getItem('token');
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// const AppCore = () => {
//   const { user } = useAuth();
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const { data } = await axios.get('/api/products');
//         setProducts(data);
//       } catch (err) {
//         console.error(err);
//         toast.error('Failed to load products');
//       }
//     };
//     fetchProducts();
//   }, []);

//   /* ----------------------- ADD‑TO‑CART ----------------------- */
//   const addToCart = async (product) => {
//     if (!user) {
//       toast.info('Please log in to add items to your cart.');
//       return;
//     }

//     try {
//       const response = await axios.post('/api/auth/cart', {
//         product_id: product.id,
//         arrangement: product.arrangement || 'bouquet', // Provide default if missing
//       });
      
//       // Use the message from the server response
//       toast.success(response.data.message || 'Product added to cart!');
//     } catch (err) {
//       console.error(err);
//       toast.error(err.response?.data?.message || 'Failed to add to cart.');
//     }
//   };

//   return (
//     <Router>
//       <Navbar />
//       <ToastContainer position="top-right" autoClose={2500} />
//       <Routes>
//         {/* Main Routes */}
//         <Route path="/" element={<Home products={products} addToCart={addToCart} />} />
//         <Route path="/products" element={<Products addToCart={addToCart} />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/cart" element={<CartPage userId={user ? user.id : null} />} />
//         <Route path="/about" element={<About />} />
//         <Route path="/contact" element={<Contact />} />
        
//         {/* Admin Routes */}
//         <Route path="/admin/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
//         <Route path="/admin/add-product" element={<AdminRoute><AddProduct /></AdminRoute>} />
//         <Route path="/admin/products" element={<AdminRoute><AllProducts /></AdminRoute>} />
//         <Route path="/admin/edit-product/:id" element={<AdminRoute><EditProduct /></AdminRoute>} />
//         <Route path="/admin/delete-product/:id" element={<AdminRoute><DeleteProduct /></AdminRoute>} />
//         <Route path="/admin/update-product/:id" element={<AdminRoute><UpdateProduct /></AdminRoute>} />
//         <Route path="/admin/products-by-type/:type" element={<AdminRoute><ProductByType /></AdminRoute>} />
//         <Route path="/admin/product-sales" element={<AdminRoute><ProductSales /></AdminRoute>} />
//         <Route path="/admin/users" element={<AdminRoute><ViewUsers /></AdminRoute>} />
//       </Routes>
//     </Router>
//   );
// };

// const MainApp = () => (
//   <AuthProvider>
//     <AdminProvider>
//       <AppCore />
//     </AdminProvider>
//   </AuthProvider>
// );

// export default MainApp;
































// import React, { useEffect, useState } from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import Home from './pages/Home';
// import Products from './pages/Products';
// import Login from './components/Auth/Login';
// import Signup from './components/Auth/Signup';
// import CartPage from './pages/Cartpage';
// import About from './pages/About';
// import Contact from './pages/Contact'; 
// import { AuthProvider, useAuth } from './context/AuthContext';
// import './styles.css';
// import axios from 'axios';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// // Configure axios
// axios.defaults.baseURL = 'http://localhost:5000';            
// axios.interceptors.request.use((config) => {                 
//   const token = localStorage.getItem('token');
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// const AppCore = () => {
//   const { user } = useAuth();
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const { data } = await axios.get('/api/products');
//         setProducts(data);
//       } catch (err) {
//         console.error(err);
//         toast.error('Failed to load products');
//       }
//     };
//     fetchProducts();
//   }, []);

//   /* ----------------------- ADD‑TO‑CART ----------------------- */
//   const addToCart = async (product) => {
//     if (!user) {
//       toast.info('Please log in to add items to your cart.');
//       return;
//     }

//     try {
//       const response = await axios.post('/api/auth/cart', {
//         product_id: product.id,
//         arrangement: product.arrangement || 'bouquet', // Provide default if missing
//       });
      
//       // Use the message from the server response
//       toast.success(response.data.message || 'Product added to cart!');
//     } catch (err) {
//       console.error(err);
//       toast.error(err.response?.data?.message || 'Failed to add to cart.');
//     }
//   };

//   return (
//     <Router>
//       <Navbar />
//       <ToastContainer position="top-right" autoClose={2500} />
//       <Routes>
//         {/* Main Routes */}
//         <Route path="/" element={<Home products={products} addToCart={addToCart} />} />
//         <Route path="/products" element={<Products addToCart={addToCart} />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/cart" element={<CartPage userId={user ? user.id : null} />} />
//         <Route path="/about" element={<About />} />
//         <Route path="/contact" element={<Contact />} />
//       </Routes>
//     </Router>
//   );
// };

// const MainApp = () => (
//   <AuthProvider>
//     <AppCore />
//   </AuthProvider>
// );

// export default MainApp;