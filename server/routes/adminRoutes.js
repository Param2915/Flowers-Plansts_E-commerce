const express = require("express");
const router = express.Router();
const { verifyToken, requireAdmin } = require("../middleware/AuthMiddleware");
const AdminController = require("../controller/AdminController");

router.get("/dashboard", verifyToken, requireAdmin, AdminController.getDashboard);
router.get("/users", verifyToken, requireAdmin, AdminController.getAllUsers);
router.delete("/delete-product/:id", verifyToken, requireAdmin, AdminController.deleteProduct);
router.post("/add-product", verifyToken, requireAdmin, AdminController.addProduct);

module.exports = router;
