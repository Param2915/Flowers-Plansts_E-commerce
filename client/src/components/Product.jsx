import React from 'react';

const Product = ({ product, addToCart }) => {
  const imageUrl = `http://localhost:5000/${product.image}`; // Ensure this is the correct path

  return (
    <div className="col-md-4 mb-4">
      <div className="card">
        <img src={imageUrl} className="card-img-top" alt={product.name} />
        <div className="card-body">
          <h5 className="card-title">{product.name}</h5>
          <p className="card-text">{product.description}</p>
          <p className="card-text"><strong>Price: ₹{product.price}</strong></p>
          <button className="btn btn-primary" onClick={() => addToCart(product)}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default Product;