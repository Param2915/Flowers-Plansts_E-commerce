const Product = require("../models/Product"); 
const Favorite = require("../models/Favorite");
const CartItem = require("../models/CartItem");
const { Op } = require("sequelize");

// Get all products
const getProducts = async (req, res) => {
  try {
    const { arrangement, type } = req.query;
    let where = {};

    if (arrangement) {
      where.arrangement = arrangement.toLowerCase();
    }

    if (type) {
      const typesArray = type.split(",");
      where.type = { [Op.in]: typesArray };
    }

    const products = await Product.findAll({ where });
    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({ message: "Database error", error: err });
  }
};

// Get a single product by ID
const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (err) {
    return res.status(500).json({ message: "Database error", error: err });
  }
};




// Add to cart
const addToCart = async (req, res) => {
  try {
    const { user_id, product_id, arrangement, price } = req.body;

    // Validate required fields
    if (!user_id || !product_id || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Optional: Check if the product exists
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Add item to cart
    const cartItem = await CartItem.create({
      user_id,
      product_id,
      arrangement,
      price
    });

    return res.status(201).json({ message: "Product added to cart", cartItem });
  } catch (err) {
    return res.status(500).json({ message: "Database error", error: err });
  }
};






// Admin: Add a new product
const addProduct = async (req, res) => {
  try {
    const { name, description, price, arrangement, color, type, image } = req.body;

    if (!name || !price || !type) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const product = await Product.create({
      name,
      description,
      price,
      arrangement,
      color,
      type,
      image
    });

    return res.status(201).json({ message: "Product added successfully", productId: product.id });
  } catch (err) {
    return res.status(500).json({ message: "Database error", error: err });
  }
};

// Admin: Update product details
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, arrangement, color, type, image } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.update({
      name,
      description,
      price,
      arrangement,
      color,
      type,
      image
    });

    return res.status(200).json({ message: "Product updated successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Database error", error: err });
  }
};

// Admin: Delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.destroy();
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Database error", error: err });
  }
};



// Add product to favorites
const addFavorite = async (req, res) => {
  try {
    const { user_id, product_id } = req.body;

    if (!user_id || !product_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if favorite already exists
    const existingFavorite = await Favorite.findOne({
      where: { user_id, product_id }
    });

    if (existingFavorite) {
      return res.status(409).json({ message: "Product already in favorites" });
    }

    // Add to favorites
    const favorite = await Favorite.create({ user_id, product_id });

    return res.status(201).json({ message: "Product added to favorites", favorite });
  } catch (err) {
    return res.status(500).json({ message: "Database error", error: err });
  }
};



// Remove product from favorites
const removeFavorite = async (req, res) => {
  try {
    const { user_id, product_id } = req.body;

    const favorite = await Favorite.findOne({
      where: {
        user_id,
        product_id
      }
    });

    if (!favorite) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    await favorite.destroy();
    return res.status(200).json({ message: "Product removed from favorites" });
  } catch (err) {
    return res.status(500).json({ message: "Database error", error: err });
  }
};

module.exports = {
  getProducts,
  getSingleProduct,
  addToCart,
  addProduct,
  updateProduct,
  deleteProduct,
  addFavorite,
  removeFavorite
};