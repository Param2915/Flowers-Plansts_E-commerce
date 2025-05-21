import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAdmin } from '../context/AdminContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isAdmin, logoutAdmin } = useAdmin();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    // Also logout from admin if user was admin
    if (isAdmin) {
      logoutAdmin();
    }
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">
          Flower Shop
        </Link>

        {/* Mobile menu toggle */}
        <div className="menu-toggle" onClick={toggleMenu}>
          <i className={isOpen ? "fas fa-times" : "fas fa-bars"}></i>
        </div>

        {/* Navigation links */}
        <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={() => setIsOpen(false)}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/products" className="nav-link" onClick={() => setIsOpen(false)}>
              Products
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-link" onClick={() => setIsOpen(false)}>
              About
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/contact" className="nav-link" onClick={() => setIsOpen(false)}>
              Contact
            </Link>
          </li>
          
          {/* Show Admin Dashboard link only if user is admin */}
          {isAdmin && (
            <li className="nav-item admin-link">
              <Link to="/admin/dashboard" className="nav-link" onClick={() => setIsOpen(false)}>
                Admin Dashboard
              </Link>
            </li>
          )}
        </ul>

        {/* Auth links */}
        <div className={`auth-links ${isOpen ? 'active' : ''}`}>
          {user ? (
            <>
              <Link to="/cart" className="cart-icon" onClick={() => setIsOpen(false)}>
                <i className="fas fa-shopping-cart"></i>
                <span>Cart</span>
              </Link>
              <div className="user-info">
                <span className="welcome-text">
                  Hello, {isAdmin ? 'Admin' : user.name}
                </span>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="auth-link" onClick={() => setIsOpen(false)}>
                Login
              </Link>
              <Link to="/signup" className="auth-link signup" onClick={() => setIsOpen(false)}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


























// import React from 'react';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const Navbar = () => {
//   const { user, logout } = useAuth();

//   return (
//     <nav className="navbar navbar-expand-lg navbar-light bg-light">
//       <div className="container">
//         <Link className="navbar-brand" to="/">Flower Shop</Link>
//         <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
//           data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
//           aria-label="Toggle navigation">
//           <span className="navbar-toggler-icon"></span>
//         </button>

//         <div className="collapse navbar-collapse" id="navbarNav">
//           <ul className="navbar-nav me-auto">
//             <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
//             <li className="nav-item"><Link className="nav-link" to="/products">Products</Link></li>
//             <li className="nav-item"><Link className="nav-link" to="/about">About</Link></li>
//             <li className="nav-item"><Link className="nav-link" to="/contact">Contact</Link></li>
//             <li className="nav-item"><Link className="nav-link" to="/cart">Cart</Link></li>
//           </ul>

//           <ul className="navbar-nav ms-auto">
//             {!user ? (
//               <>
//                 <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
//                 <li className="nav-item"><Link className="nav-link" to="/signup">Signup</Link></li>
//               </>
//             ) : (
//               <>
//                 <li className="nav-item nav-link text-dark fw-bold">
//                   Hello, {user.name}
//                 </li>
//                 <li className="nav-item">
//                   <button onClick={logout} className="btn btn-sm btn-outline-danger ms-2">Logout</button>
//                 </li>
//               </>
//             )}
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;