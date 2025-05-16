const express = require("express");
const router = express.Router();

const {
  signupUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  addProductToCart,
  getShoppingCart,
  deleteShoppingCart,
  getItemNumber,
  addToFavorites,
  getFavorites,
} = require("../controller/UserController");

const {
  forgotPassword,
  verifyOTP,
  resetPassword,
} = require("../controller/PasswordController");

const { verifyToken, requireAdmin } = require("../middleware/AuthMiddleware");  // updated imports

// Auth Routes
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Current user (admin-only)
router.get("/getcurrent", verifyToken, requireAdmin, getCurrentUser);

// Password reset routes
router.post("/forgotPassword", forgotPassword);
router.post("/verifyOTP", verifyOTP);
router.post("/resetPassword", resetPassword);

// Shopping Cart Routes
router.post("/addproduct", verifyToken, addProductToCart);
router.get("/getshoppingcart", verifyToken, getShoppingCart);
router.get("/getitemnumber", verifyToken, getItemNumber);
router.delete("/deleteshoppingcart", verifyToken, deleteShoppingCart);

// Favorites Routes
router.post("/addtofavorites", verifyToken, addToFavorites);
router.get("/getfavorites", verifyToken, getFavorites);

module.exports = router;
