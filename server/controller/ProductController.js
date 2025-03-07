const DB = require("../config/db");

// Get all products
const getProducts = async (req, res) => {
  const { arrangement, type } = req.query;

  let query = "SELECT * FROM products WHERE 1=1";
  let queryParams = [];

  if (arrangement) {
    query += " AND arrangement = ?";
    queryParams.push(arrangement.toLowerCase());
  }

  if (type) {
    const typesArray = type.split(",");
    const placeholders = typesArray.map(() => "?").join(",");
    query += ` AND type IN (${placeholders})`;
    queryParams.push(...typesArray);
  }

  DB.query(query, queryParams, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    return res.status(200).json(result);
  });
};

// Get a single product by ID
const getSingleProduct = async (req, res) => {
  const { id } = req.params;

  const query = "SELECT * FROM products WHERE id = ?";

  DB.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    return res.status(200).json(result);
  });
};

// Admin: Add a new product
const addProduct = async (req, res) => {
  const { name, description, price, arrangement, color, type, image } = req.body;

  if (!name || !price || !type) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const query = `INSERT INTO products (name, description, price, arrangement, color, type, image) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const values = [name, description, price, arrangement, color, type, image];

  DB.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    return res.status(201).json({ message: "Product added successfully", productId: result.insertId });
  });
};

// Admin: Update product details
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, arrangement, color, type, image } = req.body;

  if (!id || !name || !price || !type) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const query = `UPDATE products 
                 SET name=?, description=?, price=?, arrangement=?, color=?, type=?, image=? 
                 WHERE id=?`;
  const values = [name, description, price, arrangement, color, type, image, id];

  DB.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    return res.status(200).json({ message: "Product updated successfully" });
  });
};

// Admin: Delete a product
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM products WHERE id = ?";

  DB.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    return res.status(200).json({ message: "Product deleted successfully" });
  });
};

// Remove product from favorites
const removeFavorite = async (req, res) => {
  const { user_id, product_id } = req.body;
  const query = "DELETE FROM favorites WHERE user_id = ? AND product_id = ?";

  DB.query(query, [user_id, product_id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    return res.status(200).json({ message: "Product removed from favorites" });
  });
};

module.exports = {
  getProducts,
  getSingleProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  removeFavorite,
};
