const bcrypt = require("bcrypt");
const User = require("../models/User");
const Product = require("../models/Product");
const ShoppingCartItem = require("../models/CartItem");
const Favorite = require("../models/Favorite");

// SIGNUP
const signupUser = async (req, res) => {
  const { name, surname, phone, email, password } = req.body;

  if (!name || !surname || !phone || !email || !password) {
    return res.status(400).json({ message: "Provide all fields" });
  }

  try {
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: "User or email already exists" });
    }

    const hashPW = await bcrypt.hash(password, 10);
    await User.create({ name, surname, phone, email, password: hashPW });

    return res.status(200).json({ message: "Signup successful" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// ADD PRODUCT TO CART
const addProductToCart = async (req, res) => {
  const { user_id, product_id, arrangement, price } = req.body;

  try {
    await ShoppingCartItem.create({ user_id, product_id, arrangement, price });
    return res.status(200).json({ message: "Product added to cart" });
  } catch (error) {
    return res.status(500).json({ message: "Database error", error });
  }
};

// GET SHOPPING CART
const getShoppingCart = async (req, res) => {
  const { user_id } = req.query;

  try {
    const items = await ShoppingCartItem.findAll({
      where: { user_id },
      include: [Product],
    });
    return res.status(200).json(items);
  } catch (error) {
    return res.status(500).json({ message: "Database error", error });
  }
};

// DELETE FROM CART
const deleteShoppingCart = async (req, res) => {
  const { shoppingCartId, user_id } = req.body;

  try {
    await ShoppingCartItem.destroy({ where: { id: shoppingCartId, user_id } });
    return res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    return res.status(500).json({ message: "Database error", error });
  }
};

// GET ITEM COUNT
const getItemNumber = async (req, res) => {
  const { user_id } = req.query;
  if (!user_id) return res.status(400).json({ message: "User ID required" });

  try {
    const itemCount = await ShoppingCartItem.count({ where: { user_id } });
    return res.status(200).json({ itemCount });
  } catch (error) {
    return res.status(500).json({ message: "Database error", error });
  }
};

// ADD TO FAVORITES
const addToFavorites = async (req, res) => {
  const { user_id, product_id } = req.body;

  try {
    const exists = await Favorite.findOne({ where: { user_id, product_id } });
    if (exists) {
      return res.status(400).json({ message: "Product already in favorites" });
    }

    await Favorite.create({ user_id, product_id });
    return res.status(200).json({ message: "Added to favorites" });
  } catch (error) {
    return res.status(500).json({ message: "Database error", error });
  }
};

// GET FAVORITES
const getFavorites = async (req, res) => {
  const { user_id } = req.query;

  try {
    const favorites = await Favorite.findAll({
      where: { user_id },
      include: [Product],
    });
    return res.status(200).json(favorites);
  } catch (error) {
    return res.status(500).json({ message: "Database error", error });
  }
};

module.exports = {
  signupUser,
  addProductToCart,
  getShoppingCart,
  deleteShoppingCart,
  getItemNumber,
  addToFavorites,
  getFavorites,
};
