const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId.js");

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
	try {
		const getASingleBlog = await Blog.findById(id);
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

module.exports = { createBlog, updateBlog, getASingleBlog, getAllBlogs };
