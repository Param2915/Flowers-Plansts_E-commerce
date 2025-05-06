const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Sequelize User model
require("dotenv").config(); // Make sure env variables are loaded

// Middleware to verify token and attach user with role
const AuthMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Fetch user from the DB (including the role)
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'role', 'name', 'email']
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user.role = user.role; // attach role to req.user
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token", error });
  }
};

// Middleware to check if user is an admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
};

module.exports = { AuthMiddleware, isAdmin };


