import React, { useState } from "react";
import axios from "axios";
import './DeleteProduct.css';


const ProductByType = () => {
  const [type, setType] = useState("");
  const [products, setProducts] = useState([]);

  const fetchProducts = () => {
    axios.get(`/api/admin/products-by-type/${type}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then(res => setProducts(res.data.products))
    .catch(err => console.error(err));
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h2>Products By Type</h2>
        <input
          type="text"
          placeholder="Type (e.g., flowers)"
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{margin: "10px", padding: "10px", width: "100%"}}
        />
        <button onClick={fetchProducts} className="dashboard-box">Fetch</button>
        <ul>
          {products.map(p => (
            <li key={p.id}>{p.name} - ₹{p.price}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductByType;
