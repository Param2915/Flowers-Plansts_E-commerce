import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Product from './Product';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const ProductList = ({ addToCart }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="row">
      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        products.map((product) => (
          <Product key={product.id} product={product} addToCart={addToCart} />
        ))
      )}
    </div>
  );
};

export default ProductList;