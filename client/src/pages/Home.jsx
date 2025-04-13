import React from 'react';
import ProductList from '../components/ProductList';

const Home = () => {
  return (
    <div className="container">
      <header className="text-center my-5">
        <h1 className="display-4">Welcome to Our Flower Shop</h1>
        <p className="lead">Explore our beautiful collection of flowers.</p>
      </header>

      <section className="my-5">
        <h2 className="text-center">Featured Products</h2>
        <ProductList addToCart={(product) => console.log('Add to cart:', product)} />
      </section>

      <footer className="text-center my-5">
        <p>&copy; {new Date().getFullYear()} Flower Shop. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;