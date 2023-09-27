const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

const createProduct = asyncHandler(async (req, res) => {
	try {
		if (req?.body?.title) {
			req.body.slug = slugify(req.body.title);
		}
		const newProduct = await Product.create(req.body);
		res.json(newProduct);
	} catch (error) {
		throw new Error(error);
	}
});

// get all product
const getAllProducts = asyncHandler(async (req, res) => {
	try {
		// filter
		const queryObj = { ...req.query };
		const excludeFields = ["page", "sort", "limit", "fields"];
		excludeFields.forEach((el) => delete queryObj[el]);

		let queryStr = JSON.stringify(queryObj);
		queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

		let query = Product.find(JSON.parse(queryStr));

		// sort
		if (req.query.sort) {
			const sortBy = req.query.sort.split(",").join(" ");
			query = query.sort(sortBy);
		} else {
			query = query.sort("-createdAt");
		}

		const products = await query;
		res.json(products);
	} catch (error) {
		throw new Error(error);
	}
});

// get a single product
const getASingleProduct = asyncHandler(async (req, res) => {
	const { id } = req.params;
	try {
		const findProduct = await Product.findById(id);
		res.json(findProduct);
	} catch (error) {
		throw new Error(error);
	}
});

// update product
const updateProduct = asyncHandler(async (req, res) => {
	const { id } = req.params;
	console.log(req.body);
	try {
		if (req.body.title) {
			req.body.slug = slugify(req.body.title);
		}
		const updateProduct = await Product.findByIdAndUpdate(id, req.body, {
			new: true,
		});
		res.json(updateProduct);
	} catch (error) {
		throw new Error(error);
	}
});

// delete product
const deleteProduct = asyncHandler(async (req, res) => {
	const { id } = req.params;
	try {
		const deleteProduct = await Product.findByIdAndDelete(id);
		res.json(deleteProduct);
	} catch (error) {
		throw new Error(error);
	}
});

module.exports = {
	createProduct,
	getASingleProduct,
	getAllProducts,
	updateProduct,
	deleteProduct,
};
