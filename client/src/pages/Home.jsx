import React from 'react';
import { useNavigate } from 'react-router-dom'; // 👉 added navigate hook
import ProductList from '../components/ProductList';
import './Home.css';

const Home = ({ products, addToCart }) => {
  const navigate = useNavigate(); // 👉 navigate instance

  return (
    <div className="home-container">
      <header className="hero">
        <h1>Welcome to Our Flower Shop</h1>
        <p>Explore our beautiful collection of flowers.</p>

        {/* 👉 Admin Panel button */}
        <button 
          onClick={() => navigate('/admin/login')}
          style={{
            padding: '10px 25px',
            backgroundColor: '#d63384',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            fontSize: '1rem',
            marginTop: '1rem',
            cursor: 'pointer'
          }}
        >
          Go to Admin Panel
        </button>
      </header>

      <section className="products-section">
        <h2>Featured Products</h2>
        <ProductList products={products} addToCart={addToCart} />
      </section>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Flower Shop. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
