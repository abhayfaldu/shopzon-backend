const express = require("express");
const {
	createColor,
	updateColor,
	getAllColors,
	deleteColor,
	getASingleColor,
} = require("../controllers/colorController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { isAdmin } = require("../middlewares/isAdmin.js");
const router = express.Router();

router.get("/", getAllColors);
router.get("/:id", getASingleColor);

router.post("/", authMiddleware, isAdmin, createColor);
router.put("/:id", authMiddleware, isAdmin, updateColor);
router.delete("/:id", authMiddleware, isAdmin, deleteColor);

module.exports = router;
