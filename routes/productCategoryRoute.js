const express = require("express");
const { createCategory } = require("../controllers/productCategoryControllers");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createCategory);

module.exports = router;
