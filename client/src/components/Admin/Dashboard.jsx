import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { logoutAdmin } = useAdmin();

  const handleLogout = () => {
    logoutAdmin();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h2>Admin Dashboard</h2>
        <div className="dashboard-links">
          <Link to="/admin/add-product" className="dashboard-box">➕ Add Product</Link>
          <Link to="/admin/products" className="dashboard-box">📦 View All Products</Link>
          <Link to="/admin/delete-product/:id" className="dashboard-box">❌ Delete Product</Link>
          <Link to="/admin/update-product/:id" className="dashboard-box">📝 Update Product</Link>
          <Link to="/admin/products-by-type/:type" className="dashboard-box">🌸 Products by Type</Link>
          <Link to="/admin/product-sales" className="dashboard-box">💰 Product Sales</Link>
          <Link to="/admin/users" className="dashboard-box">👥 View Users</Link>
          <button onClick={handleLogout} className="dashboard-box logout-btn">🚪 Logout</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;