const express = require("express");
const router = express.Router();

const {
  getProducts,
  getSingleProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  removeFavorite,
  addFavorite,
  addToCart,
  getShoppingCart,
  updateCartQuantity,
  deleteCartItem,
} = require("../controller/ProductController");

const { verifyToken, requireAdmin } = require("../middleware/AuthMiddleware"); // updated imports

// Public product routes
router.get("/", getProducts);
router.get("/:id", getSingleProduct);

// Favorites
router.delete("/removefavorite", verifyToken, removeFavorite);
router.post("/favorite/add", verifyToken, addFavorite);

// Cart routes - require authentication
router.post("/cart/add", verifyToken, addToCart);
router.get("/cart", verifyToken, getShoppingCart);             // Get all cart items for logged-in user
router.put("/cart/update", verifyToken, updateCartQuantity);   // Update quantity for cart item
router.delete("/cart/delete", verifyToken, deleteCartItem);    // Delete cart item

// Admin only routes
router.post("/add", verifyToken, requireAdmin, addProduct);
router.put("/:id", verifyToken, requireAdmin, updateProduct);
router.delete("/:id", verifyToken, requireAdmin, deleteProduct);

module.exports = router;
