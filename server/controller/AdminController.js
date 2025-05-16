const User = require("../models/User");
const Product = require("../models/Product");

const getDashboard = async (req, res) => {
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

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "surname", "email", "phone", "role"],
    });
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch users", error: err });
  }
};

const deleteProduct = async (req, res) => {
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

const addProduct = async (req, res) => {
  try {
    const { name, description, price, image_url } = req.body;

    if (!name || !description || !price || !image_url) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newProduct = await Product.create({ name, description, price, image_url });

    return res.status(201).json({ message: "Product created successfully", product: newProduct });
  } catch (err) {
    return res.status(500).json({ message: "Failed to add product", error: err });
  }
};

module.exports = {
  getDashboard,
  getAllUsers,
  deleteProduct,
  addProduct,
};
