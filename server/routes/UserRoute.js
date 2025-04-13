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

const { AuthMiddleware, isAdmin } = require("../middleware/AuthMiddleware");

// Auth Routes
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Current user (admin-only)
router.get("/getcurrent", AuthMiddleware, isAdmin, getCurrentUser);

// Password reset routes
router.post("/forgotPassword", forgotPassword);
router.post("/verifyOTP", verifyOTP);
router.post("/resetPassword", resetPassword);

// Shopping Cart Routes
router.post("/addproduct", AuthMiddleware, addProductToCart);
router.get("/getshoppingcart", AuthMiddleware, getShoppingCart);
router.get("/getitemnumber", AuthMiddleware, getItemNumber);
router.delete("/deleteshoppingcart", AuthMiddleware, deleteShoppingCart);

// Favorites Routes
router.post("/addtofavorites", AuthMiddleware, addToFavorites);
router.get("/getfavorites", AuthMiddleware, getFavorites);

module.exports = router;
