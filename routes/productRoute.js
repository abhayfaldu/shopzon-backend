const express = require("express");
const {
	createProduct,
	getASingleProduct,
	getAllProducts,
	updateProduct,
	deleteProduct,
} = require("../controllers/productController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createProduct);
router.get("/:id", getASingleProduct);
router.get("/", getAllProducts);
router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);

module.exports = router;
