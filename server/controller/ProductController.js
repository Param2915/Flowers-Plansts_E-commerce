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
      price,
      quantity: 1,  // Default quantity on add
    });

    return res.status(201).json({ message: "Product added to cart", cartItem });
  } catch (err) {
    return res.status(500).json({ message: "Database error", error: err });
  }
};

// Get all cart items for a user (with product details)
const getShoppingCart = async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(400).json({ message: "Missing user_id in query" });
    }

    const cartItems = await CartItem.findAll({
      where: { user_id },
      include: [{ model: Product }],
    });

    return res.status(200).json(cartItems);
  } catch (err) {
    return res.status(500).json({ message: "Database error", error: err });
  }
};

// Update the quantity of a cart item
const updateCartQuantity = async (req, res) => {
  try {
    const { shoppingCartId, user_id, quantity } = req.body;

    if (!shoppingCartId || !user_id || !quantity || quantity < 1) {
      return res.status(400).json({ message: "Missing or invalid fields" });
    }

    const cartItem = await CartItem.findOne({
      where: { id: shoppingCartId, user_id },
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    await cartItem.update({ quantity });

    return res.status(200).json({ message: "Quantity updated", cartItem });
  } catch (err) {
    return res.status(500).json({ message: "Database error", error: err });
  }
};

// Delete a cart item
const deleteCartItem = async (req, res) => {
  try {
    const { shoppingCartId, user_id } = req.body;

    if (!shoppingCartId || !user_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const cartItem = await CartItem.findOne({
      where: { id: shoppingCartId, user_id },
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    await cartItem.destroy();

    return res.status(200).json({ message: "Cart item removed" });
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

    const existingFavorite = await Favorite.findOne({
      where: { user_id, product_id }
    });

    if (existingFavorite) {
      return res.status(409).json({ message: "Product already in favorites" });
    }

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
  getShoppingCart,
  updateCartQuantity,
  deleteCartItem,
  addProduct,
  updateProduct,
  deleteProduct,
  addFavorite,
  removeFavorite,
};
