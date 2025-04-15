const express = require("express");
const { AuthMiddleware, isAdmin } = require("../middleware/AuthMiddleware");

const router = express.Router();

const {getProducts,getSingleProduct, addProduct,updateProduct,deleteProduct,removeFavorite,addFavorite,addToCart} = require("../controller/ProductController");

router.get("/",getProducts)
router.get("/:id",getSingleProduct)
router.delete("/removefavorite",removeFavorite);
router.post("/cart/add", AuthMiddleware, addToCart);
router.post("/favorite/add", AuthMiddleware, addFavorite); 

// Only authenticated users can access
router.post("/add", AuthMiddleware, isAdmin, addProduct);
router.put("/:id", AuthMiddleware, isAdmin, updateProduct);
router.delete("/:id", AuthMiddleware, isAdmin, deleteProduct);


module.exports = router;