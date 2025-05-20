import React, { useEffect, useState } from "react";
import axios from "axios";
import './DeleteProduct.css';

const ProductSales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/admin/product-sales", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then(res => {
      setSales(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setError("Failed to fetch product sales.");
      setLoading(false);
    });
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h2>Product Sales</h2>
        {loading && <p>Loading...</p>}
        {error && <p style={{color:"red"}}>{error}</p>}
        <ul>
          {sales.map(s => (
            <li key={s.product_id}>
              {s.Product.name} — Sold: {s.totalSold}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductSales;
