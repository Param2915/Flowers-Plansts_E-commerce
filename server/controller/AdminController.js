// server/controller/AdminController.js
const User = require("../models/User");
const Product = require("../models/Product");
const CartItem = require("../models/CartItem");
const sequelize = require("../config/db");


exports.getDashboard = async (req, res) => {
  try {
    return res.status(200).json({
      message: "Welcome to the Admin Dashboard",
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong", error: err });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "surname", "email", "phone", "role"],
    });
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch users", error: err });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const { name, description, price, image_url } = req.body;
    if (!name || !description || !price || !image_url) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newProduct = await Product.create({ name, description, price, image_url });
    return res
      .status(201)
      .json({ message: "Product created successfully", product: newProduct });
  } catch (err) {
    return res.status(500).json({ message: "Failed to add product", error: err });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to delete product", error: err });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const [updatedRows] = await Product.update(updates, { where: { id } });
    if (updatedRows === 0) {
      return res.status(404).json({ message: "Product not found or no changes made" });
    }

    const updatedProduct = await Product.findByPk(id);
    return res.status(200).json({ message: "Product updated", product: updatedProduct });
  } catch (err) {
    return res.status(500).json({ message: "Failed to update product", error: err });
  }
};

exports.getProductsByType = async (req, res) => {
  try {
    const { type } = req.params;

    const products = await Product.findAll({ where: { type } });

    if (products.length === 0) {
      return res.status(404).json({ message: `No products found for type: ${type}` });
    }

    return res.status(200).json({ type, products });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch products by type", error: err });
  }
};

exports.getProductSales = async (req, res) => {
  try {
    const sales = await CartItem.findAll({
      attributes: [
        "product_id",
        [sequelize.fn("SUM", sequelize.col("quantity")), "totalSold"],
      ],
      group: ["product_id"],
      include: [{ model: Product, attributes: ["name", "price"] }],
    });

    return res.status(200).json(sales);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch sales data", error: err });
  }
};