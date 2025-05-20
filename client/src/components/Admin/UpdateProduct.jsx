import React, { useState } from "react";
import axios from "axios";
import './DeleteProduct.css';


const UpdateProduct = () => {
  const [productId, setProductId] = useState("");
  const [updates, setUpdates] = useState({});

  const handleChange = (e) => {
    setUpdates({...updates, [e.target.name]: e.target.value});
  };

  const handleUpdate = () => {
    axios.put(`http://localhost:3000/api/admin/update-product/${productId}`, updates, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then(() => alert("Product updated"))
    .catch(err => console.error(err));
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h2>Update Product</h2>
        <input
          type="text"
          placeholder="Product ID"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          style={{margin: "10px", padding: "10px", width: "100%"}}
        />
        <input
          type="text"
          name="name"
          placeholder="New Name"
          onChange={handleChange}
          style={{margin: "10px", padding: "10px", width: "100%"}}
        />
        <button onClick={handleUpdate} className="dashboard-box">Update</button>
      </div>
    </div>
  );
};

export default UpdateProduct;
