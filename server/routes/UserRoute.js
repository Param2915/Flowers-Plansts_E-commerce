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
  getFavorites
} = require("../controller/UserController.js");
const {AuthMiddleware, isAdmin} = require("../middleware/AuthMiddleware.js");
const { forgotPassword, verifyOTP, resetPassword } = require( "../controller/PasswordController.js");


router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.get("/getcurrent", AuthMiddleware, isAdmin, getCurrentUser); //only admin

router.post("/forgotPassword", forgotPassword);
router.post("/verifyOTP", verifyOTP);
router.post("/resetPassword", resetPassword);

router.post("/addproduct", AuthMiddleware, addProductToCart); // Added AuthMiddleware to restrict to logged-in users
router.get("/getshoppingcart", AuthMiddleware, getShoppingCart);
router.get("/getitemnumber", AuthMiddleware, getItemNumber);
router.delete("/deleteshoppingcart", AuthMiddleware, deleteShoppingCart);

// Favorites Routes
router.post("/addtofavorites", AuthMiddleware, addToFavorites);
router.get("/getfavorites", AuthMiddleware, getFavorites);


module.exports = router;