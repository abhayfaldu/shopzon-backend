const Blog = require("../models/blogModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId.js");

// like blog
const likeBlog = asyncHandler(async (req, res) => {
	const { blogId } = req.body;
	validateMongodbId(blogId);

	// Find the blog which you want to be liked
	const blog = await Blog.findById(blogId);
	// Find the logged in user
	const loginUserId = req?.user?._id;

	// Find if the user has liked the blog
	const isLiked = blog?.isLiked;
	// Find the user has disliked the blog
	const alreadyDisliked = blog?.isDisliked?.find(
		(userId = userId?.toString() === loginUserId?.toString())
	);
	if (alreadyDisliked) {
		const blog = await Blog.findByIdAndUpdate(blogId, {
			$pull: { dislikes: loginUserId },
			isDisliked: false,
		});
	}
});
