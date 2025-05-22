const express = require("express");
const router = express.Router();

const { login } = require("../controller/authController");  // 🆕 Import login for admin login
const AdminController = require("../controller/AdminController");
const { verifyToken, requireAdmin } = require("../middleware/AuthMiddleware");

// ── PUBLIC ──
// Admin login route
router.post("/login", login);

// ── PROTECTED ──
router.get("/dashboard", verifyToken, requireAdmin, AdminController.getDashboard);
router.get("/users", verifyToken, requireAdmin, AdminController.getAllUsers);
router.delete("/users/:userId", verifyToken, requireAdmin, AdminController.deleteUser);
router.post("/add-product", verifyToken, requireAdmin, AdminController.addProduct);
router.get("/product/:id", verifyToken, requireAdmin, AdminController.getProductById);
router.delete("/delete-product/:id", verifyToken, requireAdmin, AdminController.deleteProduct);
router.put("/update-product/:id", verifyToken, requireAdmin, AdminController.updateProduct);
router.get("/products-by-type/:type", verifyToken, requireAdmin, AdminController.getProductsByType);// Get Products by Type
router.get("/product-sales", verifyToken, requireAdmin, AdminController.getProductSales); // Get Overall Product Sales


module.exports = router;
