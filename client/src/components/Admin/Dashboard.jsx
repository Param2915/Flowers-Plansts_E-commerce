import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css'; // make sure this path matches

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h2>Admin Dashboard</h2>
        <div className="dashboard-links">
          <Link to="/admin/add-product" className="dashboard-box">➕ Add Product</Link>
<Link to="/admin/products" className="dashboard-box">📦 View All Products</Link>
<button onClick={handleLogout} className="dashboard-box logout-btn">🚪 Logout</button>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
