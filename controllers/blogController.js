const Blog = require("../models/blogModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId.js");
const cloudinaryUploadImg = require("../utils/cloudinary");
const fs = require("fs");

// create blog
const createBlog = asyncHandler(async (req, res) => {
	try {
		const newBlog = await Blog.create(req.body);
		res.json(newBlog);
	} catch (error) {
		throw new Error(error);
	}
});

// update blog
const updateBlog = asyncHandler(async (req, res) => {
	const { id } = req.params;
	try {
		const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {
			new: true,
		});
		res.json(updateBlog);
	} catch (error) {
		throw new Error(error);
	}
});

// get a single blog
const getASingleBlog = asyncHandler(async (req, res) => {
	const { id } = req.params;
	validateMongodbId(id);
	try {
		const getASingleBlog = await Blog.findById(id).populate("likes");
		await Blog.findByIdAndUpdate(
			id,
			{ $inc: { numOfViews: 1 } },
			{ new: true }
		);
		res.json(getASingleBlog);
	} catch (error) {
		throw new Error(error);
	}
});

// get all blogs
const getAllBlogs = asyncHandler(async (req, res) => {
	try {
		const Blogs = await Blog.find();
		res.json(Blogs);
	} catch (error) {
		throw new Error(error);
	}
});

// delete blog
const deleteBlog = asyncHandler(async (req, res) => {
	const { id } = req.params;
	validateMongodbId(id);
	try {
		const deletedBlog = await Blog.findById(id);
		await Blog.findByIdAndDelete(id);
		res.json(deletedBlog);
	} catch (error) {
		throw new Error(error);
	}
});

// like blog
const likeBlog = asyncHandler(async (req, res) => {
	const { blogId } = req.body;
	validateMongodbId(blogId);

	// Find the blog which you want to be liked
	const blog = await Blog.findById(blogId);
	// Find the logged in user id
	const loginUserId = req?.user?._id;

	// Check if the user has already liked the blog
	const isLiked = blog?.isLiked;
	// Check if the user has already disliked the blog
	const alreadyDisliked = blog?.dislikes?.find(
		(userId) => userId?.toString() === loginUserId?.toString()
	);

	let changedBlog;
	if (alreadyDisliked) {
		changedBlog = await Blog.findByIdAndUpdate(
			blogId,
			{
				$pull: { dislikes: loginUserId },
				isDisliked: false,
			},
			{ new: true }
		);
	}

	if (isLiked) {
		changedBlog = await Blog.findByIdAndUpdate(
			blogId,
			{
				$pull: { likes: loginUserId },
				isLiked: false,
			},
			{ new: true }
		);
	} else {
		changedBlog = await Blog.findByIdAndUpdate(
			blogId,
			{
				$push: { likes: loginUserId },
				isLiked: true,
			},
			{ new: true }
		);
	}
	res.json(changedBlog);
});

// dislike blog
const dislikeBlog = asyncHandler(async (req, res) => {
	const { blogId } = req.body;
	validateMongodbId(blogId);

	// Find the blog which you want to be liked
	const blog = await Blog.findById(blogId);
	// Find the logged in user id
	const loginUserId = req?.user?._id;

	// Check if the user has already liked the blog
	const isDisliked = blog?.isDisliked;
	// Check if the user has already disliked the blog
	const alreadyLiked = blog?.likes?.find(
		(userId) => userId?.toString() === loginUserId?.toString()
	);

	let changedBlog;
	if (alreadyLiked) {
		changedBlog = await Blog.findByIdAndUpdate(
			blogId,
			{
				$pull: { likes: loginUserId },
				isLiked: false,
			},
			{ new: true }
		);
	}

	if (isDisliked) {
		changedBlog = await Blog.findByIdAndUpdate(
			blogId,
			{
				$pull: { dislikes: loginUserId },
				isDisliked: false,
			},
			{ new: true }
		);
	} else {
		changedBlog = await Blog.findByIdAndUpdate(
			blogId,
			{
				$push: { dislikes: loginUserId },
				isDisliked: true,
			},
			{ new: true }
		);
	}
	res.json(changedBlog);
});

// upload images
const uploadImages = asyncHandler(async (req, res) => {
	const { id } = req.params;
	validateMongodbId(id);

	try {
		const uploader = (path) => cloudinaryUploadImg(path, "images");
		const urls = [];
		const files = req.files;

		for (const file of files) {
			const { path } = file;
			const newPath = await uploader(path);
			urls.push(newPath);
			fs.unlinkSync(path);
		}
		const updatedBlog = await Blog.findByIdAndUpdate(
			id,
			{ images: urls.map((file) => file) },
			{ new: true }
		);
		res.json(updatedBlog);
	} catch (error) {
		throw new Error(error);
	}
});

module.exports = {
	createBlog,
	updateBlog,
	getASingleBlog,
	getAllBlogs,
	deleteBlog,
	likeBlog,
	dislikeBlog,
	uploadImages,
};
