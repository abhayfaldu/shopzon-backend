const express = require("express");
const {
	createProduct,
	getASingleProduct,
	getAllProducts,
	updateProduct,
	deleteProduct,
	addToWishlist,
	rating,
	uploadImages,
} = require("../controllers/productController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { isAdmin } = require("../middlewares/isAdmin.js");
const {
	uploadImage,
	productImgResize,
} = require("../middlewares/uploadImages");
const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getASingleProduct);

router.put("/rating", authMiddleware, rating);
router.put("/wishlist", authMiddleware, addToWishlist);

router.post("/", authMiddleware, isAdmin, createProduct);
router.put(
	"/upload",
	authMiddleware,
	isAdmin,
	uploadImage.array("images", 10),
	productImgResize,
	uploadImages
);
router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);

module.exports = router;
