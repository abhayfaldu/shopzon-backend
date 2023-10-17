const express = require("express");
const {
	createCategory,
	updateCategory,
	getAllCategories,
	deleteCategory,
	getASingleCategory,
} = require("../controllers/productCategoryController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/", getAllCategories);
router.get("/:id", getASingleCategory);

router.post("/", authMiddleware, isAdmin, createCategory);
router.put("/:id", authMiddleware, isAdmin, updateCategory);
router.delete("/:id", authMiddleware, isAdmin, deleteCategory);

module.exports = router;
