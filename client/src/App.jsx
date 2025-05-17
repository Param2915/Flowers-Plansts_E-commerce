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

axios.defaults.baseURL = 'http://localhost:5000';            // << centralise base URL
axios.interceptors.request.use((config) => {                 // << attach token automatically
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
        <Route path="/"          element={<Home     products={products} addToCart={addToCart} />} />
        <Route path="/products"  element={<Products  addToCart={addToCart} />} />
        <Route path="/login"     element={<Login   />} />
        <Route path="/signup"    element={<Signup  />} />
        <Route path="/cart"      element={<CartPage />} />
        <Route path="/about"     element={<About   />} />
        <Route path="/contact"   element={<Contact />} />
        
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

























// import React, { useEffect, useState } from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import Home from './pages/Home';
// import Products from './pages/Products';
// import Login from './components/Auth/Login';
// import Signup from './components/Auth/Signup';
// import CartPage from './pages/Cartpage';
// import About from './pages/About';
// import Contact from './pages/Contact';  // ✅ Added Contact page import
// import { AuthProvider, useAuth } from './context/AuthContext';
// import './styles.css';
// import axios from 'axios';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const App = () => {
//   const { user } = useAuth();
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const res = await axios.get('http://localhost:5000/api/products');
//         setProducts(res.data);
//       } catch (error) {
//         console.error('Error fetching products:', error);
//       }
//     };
//     fetchProducts();
//   }, []);

//   const addToCart = async (product) => {
//   if (!user) {
//     toast.success('Please log in to add items to your cart.');
//     return;
//   }
  
//   try {
//     // Get the token from your auth context or localStorage
//     const token = localStorage.getItem('token');
    
//     await axios.post('http://localhost:5000/api/auth/cart', 
//       {
//         product_id: product.id,
//         arrangement: product.arrangement
//       },
//       {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       }
//     );
    
//     toast.success('Product added to cart!');
//   } catch (error) {
//     console.error(error);
//     toast.error('Failed to add to cart.');
//   }
// };

//   return (
//     <Router>
//       <Navbar />
//       <ToastContainer />
//       <Routes>
//         <Route path="/" element={<Home products={products} addToCart={addToCart} />} />
//         <Route path="/products" element={<Products addToCart={addToCart} />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/cart" element={<CartPage userId={user ? user.id : null} />} />
//         <Route path="/about" element={<About />} />
//         <Route path="/contact" element={<Contact />} />  {/* ✅ Contact route added */}
//       </Routes>
//     </Router>
//   );
// };

// const MainApp = () => (
//   <AuthProvider>
//     <App />
//   </AuthProvider>
// );

// export default MainApp;
