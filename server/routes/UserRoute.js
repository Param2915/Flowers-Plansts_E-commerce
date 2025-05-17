const express = require("express");
const router = express.Router();
const {
  signupUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  addOrUpdateCartItem,
  getShoppingCart,
  decrementCartItem,
  clearCart,
  getItemNumber,
  addToFavorites,
  getFavorites,
} = require("../controller/UserController");

const {
  forgotPassword,
  verifyOTP,
  resetPassword,
} = require("../controller/PasswordController");

const { verifyToken, requireAdmin } = require("../middleware/AuthMiddleware");

/* ---------- AUTH ---------- */
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

/* ---------- USER ---------- */
router.get("/current", verifyToken, requireAdmin, getCurrentUser);

/* ---------- PASSWORD ---------- */
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

/* ---------- CART ---------- */
router.post("/cart", verifyToken, addOrUpdateCartItem);          // add/increment
router.get("/getcart", verifyToken, getShoppingCart);               // list
router.patch("/cart/decrement", verifyToken, decrementCartItem); // decrement / remove
router.delete("/cart", verifyToken, clearCart);                  // clear all
router.get("/cart/count", verifyToken, getItemNumber);           // badge count

/* ---------- FAVORITES ---------- */
router.post("/favorites", verifyToken, addToFavorites);
router.get("/favorites", verifyToken, getFavorites);

module.exports = router;