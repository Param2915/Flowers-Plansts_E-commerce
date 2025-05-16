const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

// Middleware to verify JWT token and attach user to the request
const verifyToken = async (req, res, next) => {
  let token = null;

  // Try to extract token from cookies or Authorization header
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Authentication token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id || decoded.userId, {
      attributes: ["id", "name", "email", "role"],
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token", error });
  }
};

// Middleware to allow only admins
const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Access denied. Admins only." });
};

module.exports = {
  verifyToken,
  requireAdmin,
};
