import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell
} from "recharts";
import './DeleteProduct.css'; // Keep your existing styling

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6666'];

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
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && (
          <>
            <div className="chart-container">
              <div className="chart-box">
                <h3>Bar Chart</h3>
                <BarChart width={400} height={300} data={sales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="Product.name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="totalSold" fill="#8884d8" />
                </BarChart>
              </div>

              <div className="chart-box">
                <h3>Pie Chart</h3>
                <PieChart width={400} height={300}>
                  <Pie
                    data={sales}
                    dataKey="totalSold"
                    nameKey="Product.name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                  >
                    {sales.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </div>
            </div>

            <ul style={{ marginTop: "30px" }}>
              {sales.map(s => (
                <li key={s.product_id}>
                  {s.Product.name} — Sold: {s.totalSold}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductSales;


















// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import './DeleteProduct.css';

// const ProductSales = () => {
//   const [sales, setSales] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     axios.get("http://localhost:5000/api/admin/product-sales", {
//       headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//     })
//     .then(res => {
//       setSales(res.data);
//       setLoading(false);
//     })
//     .catch(err => {
//       console.error(err);
//       setError("Failed to fetch product sales.");
//       setLoading(false);
//     });
//   }, []);

//   return (
//     <div className="dashboard-container">
//       <div className="dashboard-card">
//         <h2>Product Sales</h2>
//         {loading && <p>Loading...</p>}
//         {error && <p style={{color:"red"}}>{error}</p>}
//         <ul>
//           {sales.map(s => (
//             <li key={s.product_id}>
//               {s.Product.name} — Sold: {s.totalSold}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default ProductSales;
