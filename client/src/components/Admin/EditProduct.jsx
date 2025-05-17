import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './EditProduct.css'; // new css file for this

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
  });

  const fetchProduct = async () => {
    const res = await axios.get(`http://localhost:5000/api/products/${id}`);
    setProduct(res.data);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await axios.put(`http://localhost:5000/api/products/${id}`, product, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
      },
    });
    alert('Product updated!');
    navigate('/admin/products');
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  return (
    <div className="edit-product-container">
      <div className="edit-product-card">
        <h2>Edit Product</h2>
        <form onSubmit={handleUpdate}>
          <input 
            type="text"
            placeholder="Name"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            required
          />
          <textarea 
            placeholder="Description"
            value={product.description}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
            required
          />
          <input 
            type="number"
            placeholder="Price"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
            required
          />
          <button type="submit">Update</button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
