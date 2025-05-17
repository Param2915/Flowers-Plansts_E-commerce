// server/routes/adminRoutes.js
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
router.post(
  "/add-product",
  verifyToken,
  requireAdmin,
  AdminController.addProduct
);
router.delete(
  "/delete-product/:id",
  verifyToken,
  requireAdmin,
  AdminController.deleteProduct
);

module.exports = router;
