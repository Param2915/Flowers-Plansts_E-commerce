const express = require("express");
const router = express.Router();

const { login } = require("../controller/authController");  // 🆕 Import login for admin login
const AdminController = require("../controller/AdminController");
const { verifyToken, requireAdmin } = require("../middleware/AuthMiddleware");

// ── PUBLIC ──
// Admin login route
router.post("/login", login);

// ── PROTECTED ──
// All of these require a valid JWT AND user.role === 'admin'
router.get("/dashboard", verifyToken, requireAdmin, AdminController.getDashboard);
router.get("/users", verifyToken, requireAdmin, AdminController.getAllUsers);
router.post("/add-product", verifyToken, requireAdmin, AdminController.addProduct);
router.delete("/delete-product/:id", verifyToken, requireAdmin, AdminController.deleteProduct);
router.put(
  "/update-product/:id",
  verifyToken,
  requireAdmin,
  AdminController.updateProduct
);
// Get Products by Type (fixed: make sure AdminController has this method)
router.get(
  "/products-by-type/:type",
  verifyToken,
  requireAdmin,
  AdminController.getProductsByType
);

// Get Overall Product Sales
router.get(
  "/product-sales",
  verifyToken,
  requireAdmin,
  AdminController.getProductSales
);


module.exports = router;
