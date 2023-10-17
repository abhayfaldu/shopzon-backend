const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const {
	createBlog,
	updateBlog,
	getASingleBlog,
	getAllBlogs,
	deleteBlog,
	likeBlog,
	dislikeBlog,
	uploadImages,
} = require("../controllers/blogController");
const { uploadImage, blogImgResize } = require("../middlewares/uploadImages");

const router = express.Router();

router.post("/", authMiddleware, isAdmin, createBlog);
router.put(
	"/upload/:id",
	authMiddleware,
	isAdmin,
	uploadImage.array("images", 10),
	blogImgResize,
	uploadImages
);
router.put("/likes", authMiddleware, likeBlog);
router.put("/dislikes", authMiddleware, dislikeBlog);
router.put("/:id", authMiddleware, isAdmin, updateBlog);
router.get("/:id", getASingleBlog);
router.get("/", getAllBlogs);
router.delete("/:id", authMiddleware, isAdmin, deleteBlog);

module.exports = router;
