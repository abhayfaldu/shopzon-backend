const express = require("express");
const {
	createBrand,
	updateBrand,
	getAllBrands,
	deleteBrand,
	getASingleBrand,
} = require("../controllers/brandController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/", getAllBrands);
router.get("/:id", getASingleBrand);

router.post("/", authMiddleware, isAdmin, createBrand);
router.put("/:id", authMiddleware, isAdmin, updateBrand);
router.delete("/:id", authMiddleware, isAdmin, deleteBrand);

module.exports = router;
