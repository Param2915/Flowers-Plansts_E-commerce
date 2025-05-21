import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiPlusCircle } from 'react-icons/fi';
import './AddProduct.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    image: null,
    arrangement: '',
    color: '',
    type: '',
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (const key in product) {
      formData.append(key, product[key]);
    }

    try {
      await axios.post('http://localhost:5000/api/products/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      toast.success('Product Added!');
      navigate('/admin/products');
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error('Error adding product');
    }
  };

  return (
    <div className="add-product-container">
      <ToastContainer />
      <div className="add-product-card">
        <h2><FiPlusCircle className="product-icon" /> Add New Product</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Name" value={product.name} onChange={(e) => setProduct({...product, name: e.target.value})} required />
          <textarea placeholder="Description" value={product.description} onChange={(e) => setProduct({...product, description: e.target.value})} required />
          <input type="number" placeholder="Price" value={product.price} onChange={(e) => setProduct({...product, price: e.target.value})} required />
          <input type="text" placeholder="Arrangement (e.g., bouquet, pot)" value={product.arrangement} onChange={(e) => setProduct({...product, arrangement: e.target.value})} required />
          <input type="text" placeholder="Color (e.g., red, white)" value={product.color} onChange={(e) => setProduct({...product, color: e.target.value})} required />
          <input type="text" placeholder="Type (e.g., flower, plant)" value={product.type} onChange={(e) => setProduct({...product, type: e.target.value})} required />
          <input type="file" onChange={(e) => setProduct({...product, image: e.target.files[0]})} required />
          <button type="submit">Add Product</button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;



























// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { FiPlusCircle } from 'react-icons/fi';
// import './AddProduct.css'; // assuming you’ll keep this CSS file alongside
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const AddProduct = () => {
//   const [product, setProduct] = useState({
//     name: '',
//     description: '',
//     price: '',
//     image: null,
//   });
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append('name', product.name);
//     formData.append('description', product.description);
//     formData.append('price', product.price);
//     formData.append('image', product.image);

//     try {
//       await axios.post('http://localhost:5000/api/products/add', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
//         },
//       });
//       toast.success('Product Added!');
//       navigate('/admin/products');
//     } catch (err) {
//       toast.error('Error adding product');
//     }
//   };

//   return (
//     <div className="add-product-container">
//       <div className="add-product-card">
//         <h2><FiPlusCircle className="product-icon" /> Add New Product</h2>
//         <form onSubmit={handleSubmit}>
//           <input type="text" placeholder="Name" value={product.name} onChange={(e) => setProduct({...product, name: e.target.value})} required />
//           <textarea placeholder="Description" value={product.description} onChange={(e) => setProduct({...product, description: e.target.value})} required />
//           <input type="number" placeholder="Price" value={product.price} onChange={(e) => setProduct({...product, price: e.target.value})} required />
//           <input type="file" onChange={(e) => setProduct({...product, image: e.target.files[0]})} required />
//           <button type="submit">Add Product</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddProduct;
