import React, { useEffect, useState } from "react";
import axios from "axios";
import './ViewUsers.css'; // Create a separate CSS file for better styling

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    setError("");
    
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
  };

  const handleDeleteUser = async (userId, userName, userEmail) => {
    // Confirm deletion
    const isConfirmed = window.confirm(
      `Are you sure you want to delete user "${userName}" (${userEmail})?\n\nThis action cannot be undone.`
    );
    
    if (!isConfirmed) return;

    setDeleteLoading(userId);
    
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      
      // Remove user from state
      setUsers(users.filter(user => user.id !== userId));
      
      // Clear any existing errors
      setError("");
      
    } catch (err) {
      console.error("Delete error:", err);
      const errorMessage = err.response?.data?.message || "Failed to delete user.";
      setError(errorMessage);
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="users-container">
        <div className="loading-spinner">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="users-container">
      <div className="users-header">
        <h2>All Users</h2>
        <button onClick={fetchUsers} className="refresh-btn">
          Refresh
        </button>
      </div>
      
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError("")} className="close-error">×</button>
        </div>
      )}
      
      {users.length === 0 ? (
        <div className="no-users">No users found.</div>
      ) : (
        <div className="users-list">
          {users.map(user => (
            <div key={user.id} className="user-item">
              <div className="user-info">
                <div className="user-name">{user.name}</div>
                <div className="user-email">{user.email}</div>
                {user.role && <div className="user-role">Role: {user.role}</div>}
              </div>
              <button
                onClick={() => handleDeleteUser(user.id, user.name, user.email)}
                disabled={deleteLoading === user.id}
                className={`delete-btn ${deleteLoading === user.id ? 'deleting' : ''}`}
              >
                {deleteLoading === user.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewUsers;


























// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import './DeleteProduct.css';

// const ViewUsers = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     axios.get("http://localhost:5000/api/admin/users", {
//   headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
// })

//     .then(res => {
//       setUsers(res.data);
//       setLoading(false);
//     })
//     .catch(err => {
//       console.error(err);
//       setError("Failed to fetch users.");
//       setLoading(false);
//     });
//   }, []);

//   return (
//     <div className="dashboard-container">
//       <div className="dashboard-card">
//         <h2>All Users</h2>
//         {loading && <p>Loading...</p>}
//         {error && <p style={{color:"red"}}>{error}</p>}
//         <ul>
//           {users.map(user => (
//             <li key={user.id}>{user.name} ({user.email})</li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default ViewUsers;
