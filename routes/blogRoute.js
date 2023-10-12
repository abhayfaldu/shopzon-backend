const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const {
	createBlog,
	updateBlog,
	getASingleBlog,
	getAllBlogs,
} = require("../controllers/blogController");

const router = express.Router();

router.post("/", authMiddleware, isAdmin, createBlog);
router.put("/:id", authMiddleware, isAdmin, updateBlog);
router.get("/:id", getASingleBlog);
router.get("/", getAllBlogs);

module.exports = router;
