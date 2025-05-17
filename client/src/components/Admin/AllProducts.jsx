import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './AllProducts.css';

const AllProducts = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const res = await axios.get('http://localhost:5000/api/products');
    setProducts(res.data);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product?')) {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      fetchProducts();
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="all-products-container">
      <h2>All Products</h2>
      <div className="product-grid">
        {products.map((product) => (
          <div className="product-card" key={product._id}>
            {product.image && (
              <img src={product.image} alt={product.name} />
            )}
            <h3>{product.name}</h3>
            <p>₹{product.price}</p>
            <div className="product-actions">
              <Link to={`/admin/edit-product/${product._id}`} className="edit-btn">Edit</Link>
              <button onClick={() => handleDelete(product._id)} className="delete-btn">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllProducts;
