import React from 'react';

const Product = ({ product, addToCart }) => {
  const imageUrl = product.image ? `http://localhost:5000/${product.image}` : 'https://source.unsplash.com/300x200/?flower';

  const handleAddToCart = () => {
    // Make sure product has all required properties
    const productWithDefaults = {
      ...product,
      arrangement: product.arrangement || 'bouquet', // Default arrangement
    };
    addToCart(productWithDefaults);
  };

  return (
    <div className="col-md-4 mb-4">
      <div className="card">
        <img src={imageUrl} className="card-img-top" alt={product.name} />
        <div className="card-body">
          <h5 className="card-title">{product.name}</h5>
          <p className="card-text">{product.description}</p>
          <p className="card-text"><strong>Price: ₹{product.price}</strong></p>
          <button className="btn btn-primary" onClick={handleAddToCart}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default Product;