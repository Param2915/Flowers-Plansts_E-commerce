import React, { useState } from "react";
import axios from "axios";
import './DeleteProduct.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DeleteProduct = () => {
  const [productId, setProductId] = useState("");

  const handleDelete = () => {
    axios.delete(`/api/admin/delete-product/${productId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then(() => toast.succes("Product deleted"))
    .catch(err => console.error(err));
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h2>Delete Product</h2>
        <input
          type="text"
          placeholder="Enter Product ID"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          style={{margin: "10px", padding: "10px", width: "100%"}}
        />
        <button onClick={handleDelete} className="dashboard-box">Delete</button>
      </div>
    </div>
  );
};

export default DeleteProduct;
