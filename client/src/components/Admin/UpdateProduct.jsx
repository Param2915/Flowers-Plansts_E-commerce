import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiEdit, FiSearch } from 'react-icons/fi';
import './DeleteProduct.css';

const UpdateProduct = () => {
  const [productId, setProductId] = useState("");
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    arrangement: '',
    color: '',
    type: '',
    image: ''
  });
  const [isProductLoaded, setIsProductLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Function to fetch product details by ID
  const fetchProduct = async () => {
    if (!productId) {
      toast.error("Please enter a Product ID");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/admin/product/${productId}`, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem("adminToken")}` 
        },
      });
      
      setProduct({
        name: response.data.product.name || '',
        description: response.data.product.description || '',
        price: response.data.product.price || '',
        arrangement: response.data.product.arrangement || '',
        color: response.data.product.color || '',
        type: response.data.product.type || '',
        image: response.data.product.image || ''
      });
      setIsProductLoaded(true);
      toast.success("Product loaded successfully!");
    } catch (err) {
      console.error("Error fetching product:", err);
      toast.error("Product not found or error loading product");
      setIsProductLoaded(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle input changes
  const handleChange = (e) => {
    setProduct({
      ...product, 
      [e.target.name]: e.target.value
    });
  };

  // Function to update the product
  const handleUpdate = async () => {
    if (!productId) {
      toast.error("Please enter a Product ID");
      return;
    }

    // Filter out empty values to only update fields that have been changed
    const updates = {};
    Object.keys(product).forEach(key => {
      if (product[key] && product[key].toString().trim() !== '') {
        updates[key] = product[key];
      }
    });

    if (Object.keys(updates).length === 0) {
      toast.error("Please make at least one change to update");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:5000/api/admin/update-product/${productId}`, 
        updates, 
        {
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("adminToken")}` 
          },
        }
      );
      
      toast.success("Product updated successfully!");
      console.log("Updated product:", response.data.product);
      
      // Optionally refresh the product data to show updated values
      setTimeout(() => {
        fetchProduct();
      }, 1000);
      
    } catch (err) {
      console.error("Error updating product:", err);
      toast.error(err.response?.data?.message || "Error updating product");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form when product ID changes
  useEffect(() => {
    setIsProductLoaded(false);
    setProduct({
      name: '',
      description: '',
      price: '',
      arrangement: '',
      color: '',
      type: '',
      image: ''
    });
  }, [productId]);

  return (
    <div className="dashboard-container">
      <ToastContainer />
      <div className="dashboard-card">
        <h2><FiEdit className="product-icon" /> Update Product</h2>
        
        {/* Product ID Input Section */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input
              type="text"
              placeholder="Enter Product ID"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              style={{
                margin: "10px 0", 
                padding: "12px", 
                width: "70%",
                border: "1px solid #ddd",
                borderRadius: "5px"
              }}
            />
            <button 
              onClick={fetchProduct} 
              disabled={isLoading}
              style={{
                padding: "12px 20px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: isLoading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px"
              }}
            >
              <FiSearch />
              {isLoading ? "Loading..." : "Load Product"}
            </button>
          </div>
        </div>

        {/* Product Update Form - Only show if product is loaded */}
        {isProductLoaded && (
          <div>
            <h3 style={{ color: "#28a745", marginBottom: "20px" }}>
              Update Product Details
            </h3>
            
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={product.name}
              onChange={handleChange}
              style={{
                margin: "10px 0", 
                padding: "12px", 
                width: "100%",
                border: "1px solid #ddd",
                borderRadius: "5px"
              }}
            />
            
            <textarea
              name="description"
              placeholder="Product Description"
              value={product.description}
              onChange={handleChange}
              rows="4"
              style={{
                margin: "10px 0", 
                padding: "12px", 
                width: "100%",
                border: "1px solid #ddd",
                borderRadius: "5px",
                resize: "vertical"
              }}
            />
            
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={product.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              style={{
                margin: "10px 0", 
                padding: "12px", 
                width: "100%",
                border: "1px solid #ddd",
                borderRadius: "5px"
              }}
            />
            
            <input
              type="text"
              name="arrangement"
              placeholder="Arrangement (e.g., bouquet, pot)"
              value={product.arrangement}
              onChange={handleChange}
              style={{
                margin: "10px 0", 
                padding: "12px", 
                width: "100%",
                border: "1px solid #ddd",
                borderRadius: "5px"
              }}
            />
            
            <input
              type="text"
              name="color"
              placeholder="Color (e.g., red, white)"
              value={product.color}
              onChange={handleChange}
              style={{
                margin: "10px 0", 
                padding: "12px", 
                width: "100%",
                border: "1px solid #ddd",
                borderRadius: "5px"
              }}
            />
            
            <input
              type="text"
              name="type"
              placeholder="Type (e.g., flower, plant)"
              value={product.type}
              onChange={handleChange}
              style={{
                margin: "10px 0", 
                padding: "12px", 
                width: "100%",
                border: "1px solid #ddd",
                borderRadius: "5px"
              }}
            />
            
            <input
              type="text"
              name="image"
              placeholder="Image path (e.g., uploads/image.jpg)"
              value={product.image}
              onChange={handleChange}
              style={{
                margin: "10px 0", 
                padding: "12px", 
                width: "100%",
                border: "1px solid #ddd",
                borderRadius: "5px"
              }}
            />
            
            <button 
              onClick={handleUpdate} 
              disabled={isLoading}
              className="dashboard-box"
              style={{
                marginTop: "20px",
                width: "100%",
                padding: "15px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: isLoading ? "not-allowed" : "pointer",
                fontSize: "16px",
                fontWeight: "bold"
              }}
            >
              {isLoading ? "Updating..." : "Update Product"}
            </button>
          </div>
        )}

        {/* Instructions */}
        <div style={{ 
          marginTop: "20px", 
          padding: "15px", 
          backgroundColor: "#f8f9fa", 
          borderRadius: "5px",
          fontSize: "14px",
          color: "#6c757d"
        }}>
          <strong>Instructions:</strong>
          <ol style={{ marginTop: "10px", paddingLeft: "20px" }}>
            <li>Enter the Product ID and click "Load Product" to fetch current details</li>
            <li>Modify any fields you want to update</li>
            <li>Leave fields empty if you don't want to change them</li>
            <li>Click "Update Product" to save changes</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default UpdateProduct;


























// import React, { useState } from "react";
// import axios from "axios";
// import './DeleteProduct.css';


// const UpdateProduct = () => {
//   const [productId, setProductId] = useState("");
//   const [updates, setUpdates] = useState({});

//   const handleChange = (e) => {
//     setUpdates({...updates, [e.target.name]: e.target.value});
//   };

//   const handleUpdate = () => {
//     axios.put(`http://localhost:3000/api/admin/update-product/${productId}`, updates, {
//       headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//     })
//     .then(() => alert("Product updated"))
//     .catch(err => console.error(err));
//   };

//   return (
//     <div className="dashboard-container">
//       <div className="dashboard-card">
//         <h2>Update Product</h2>
//         <input
//           type="text"
//           placeholder="Product ID"
//           value={productId}
//           onChange={(e) => setProductId(e.target.value)}
//           style={{margin: "10px", padding: "10px", width: "100%"}}
//         />
//         <input
//           type="text"
//           name="name"
//           placeholder="New Name"
//           onChange={handleChange}
//           style={{margin: "10px", padding: "10px", width: "100%"}}
//         />
//         <button onClick={handleUpdate} className="dashboard-box">Update</button>
//       </div>
//     </div>
//   );
// };

// export default UpdateProduct;
