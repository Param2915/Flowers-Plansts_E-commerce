const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  getProducts,
  getSingleProduct,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("../controller/ProductController");

const { verifyToken, requireAdmin } = require("../middleware/AuthMiddleware");

// Public product routes
router.get("/", getProducts);
router.get("/:id", getSingleProduct);

// Admin routes (use multer to parse form data)
router.post("/add", verifyToken, requireAdmin, upload.single("image"), addProduct);
router.put("/:id", verifyToken, requireAdmin, upload.single("image"), updateProduct);
router.delete("/:id", verifyToken, requireAdmin, deleteProduct);

module.exports = router;
