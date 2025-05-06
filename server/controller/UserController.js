const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Product = require("../models/Product");
const ShoppingCartItem = require("../models/CartItem");
const Favorite = require("../models/Favorite");

const signupUser = async (req, res) => {
  const { name, surname, phone, email, password } = req.body;

  if (!name || !surname || !phone || !email || !password) {
    return res.status(400).json({ message: "provide all area" });
  }

  try {
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: "username or email already exist" });
    }

    const hashPW = await bcrypt.hash(password, 10);
    await User.create({ name, surname, phone, email, password: hashPW });

    return res.status(200).json({ message: "successful" });
  } catch (error) {
    return res.status(500).json({ message: "server error", error });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password." });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password." });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Return the token and user in the response
    return res.status(200).json({
      message: "Login successful",
      token, // include the token here
      user: {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

const logoutUser = async (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "logout successful" });
};

const getCurrentUser = async (req, res) => {
  const user = req.user;
  if (!user) return res.status(400).json({ message: "user not found" });
  return res.status(200).json(user);
};

const addProductToCart = async (req, res) => {
  const { user_id, product_id, arrangement, price } = req.body;

  try {
    await ShoppingCartItem.create({ user_id, product_id, arrangement, price });
    return res.status(200).json({ message: "product added" });
  } catch (error) {
    return res.status(500).json({ message: "database error", error });
  }
};

const getShoppingCart = async (req, res) => {
  const { user_id } = req.query;

  try {
    const items = await ShoppingCartItem.findAll({
      where: { user_id },
      include: [Product],
    });
    return res.status(200).json(items);
  } catch (error) {
    return res.status(500).json({ message: "database error", error });
  }
};

const deleteShoppingCart = async (req, res) => {
  const { shoppingCartId, user_id } = req.body;

  try {
    await ShoppingCartItem.destroy({ where: { id: shoppingCartId, user_id } });
    return res.status(200).json({ message: "item removed!" });
  } catch (error) {
    return res.status(500).json({ message: "database error", error });
  }
};

const getItemNumber = async (req, res) => {
  const { user_id } = req.query;
  if (!user_id) return res.status(400).json({ message: "User ID is required" });

  try {
    const itemCount = await ShoppingCartItem.count({ where: { user_id } });
    return res.status(200).json({ itemCount });
  } catch (error) {
    return res.status(500).json({ message: "Database error", error });
  }
};

const addToFavorites = async (req, res) => {
  const { user_id, product_id } = req.body;

  try {
    const exists = await Favorite.findOne({ where: { user_id, product_id } });
    if (exists) {
      return res.status(400).json({ message: "This product is already in your favorites!" });
    }

    await Favorite.create({ user_id, product_id });
    return res.status(200).json({ message: "product added to favorites!" });
  } catch (error) {
    return res.status(500).json({ message: "database error", error });
  }
};

const getFavorites = async (req, res) => {
  const { user_id } = req.query;

  try {
    const favorites = await Favorite.findAll({
      where: { user_id },
      include: [Product],
    });
    return res.status(200).json(favorites);
  } catch (error) {
    return res.status(500).json({ message: "database error", error });
  }
};

module.exports = {
  signupUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  addProductToCart,
  getShoppingCart,
  deleteShoppingCart,
  getItemNumber,
  addToFavorites,
  getFavorites,
};

