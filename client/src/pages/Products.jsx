import React from 'react';
import ProductList from '../components/ProductList';
import './Products.css'; 
const Products = ({ addToCart }) => {
  return (
    <div className="products-page">
      <header className="products-header">
        <h1>Our Products</h1>
        <p>Browse all our lovely flower and plant arrangements.</p>
      </header>

      <section className="products-section">
        <ProductList addToCart={addToCart} />
      </section>

      <footer className="products-footer">
        <p>&copy; {new Date().getFullYear()} Flower Shop. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Products;
