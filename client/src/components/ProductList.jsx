import React from 'react';
import Product from './Product';

const ProductList = ({ products, addToCart }) => {
  return (
    <div className="row"> 
      {products.length === 0 ? (
        <div className="col-12 text-center my-5">
          <p>No products available that match your search.</p>
        </div>
      ) : (
        products.map((product) => (
          <Product key={product.id} product={product} addToCart={addToCart} />
        ))
      )}
    </div>
  );
};

export default ProductList;