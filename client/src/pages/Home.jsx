import React from 'react';
import ProductList from '../components/ProductList';
import './Home.css';

const Home = ({ products, addToCart }) => {
  return (
    <div className="home-container">
      <header className="hero">
        <h1>Welcome to Our Flower Shop</h1>
        <p>Explore our beautiful collection of flowers.</p>
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
