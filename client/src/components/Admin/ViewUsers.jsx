import React, { useEffect, useState } from "react";
import axios from "axios";
import './DeleteProduct.css';

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/admin/users", {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
})

    .then(res => {
      setUsers(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setError("Failed to fetch users.");
      setLoading(false);
    });
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h2>All Users</h2>
        {loading && <p>Loading...</p>}
        {error && <p style={{color:"red"}}>{error}</p>}
        <ul>
          {users.map(user => (
            <li key={user.id}>{user.name} ({user.email})</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ViewUsers;
