const express = require("express");
const router = express.Router();

const AuthController = require("../controller/AuthController");
const AdminController = require("../controller/AdminController");
const { verifyToken, requireAdmin } = require("../middleware/AuthMiddleware");

// ── PUBLIC ──
// POST /api/admin/login
router.post("/login", AuthController.login);

// ── PROTECTED ──
// All of these require a valid JWT AND user.role === 'admin'
router.get(
  "/dashboard",
  verifyToken,
  requireAdmin,
  AdminController.getDashboard
);

router.get(
  "/users",
  verifyToken,
  requireAdmin,
  AdminController.getAllUsers
);

// Add Product
router.post(
  "/add-product",
  verifyToken,
  requireAdmin,
  AdminController.addProduct
);

// Update Product
router.put(
  "/update-product/:id",
  verifyToken,
  requireAdmin,
  AdminController.updateProduct
);

// Delete Product
router.delete(
  "/delete-product/:id",
  verifyToken,
  requireAdmin,
  AdminController.deleteProduct
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
