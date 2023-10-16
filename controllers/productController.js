const Product = require("../models/productModel");
const User = require("../models/userModel");
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

		// limiting the fields
		if (req.query.fields) {
			const fields = req.query.fields.split(",").join(" ");
			query = query.select(fields);
		} else {
			query = query.select("-__v");
		}

		// pagination
		const page = req.query.page;
		const limit = req.query.limit;
		const skip = (page - 1) * limit;
		query = query.skip(skip).limit(limit);
		if (req.query.page) {
			const productCount = await Product.countDocuments();
			if (skip >= productCount) {
				throw new Error("This page does not exists");
			}
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

// add to wishlist
const addToWishlist = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	const { productId } = req.body;

	try {
		const user = await User.findById(_id);
		const alreadyAdded = user?.wishlist?.find(
			(id) => id.toString() === productId
		);

		let updatedUser;
		if (alreadyAdded) {
			updatedUser = await User.findByIdAndUpdate(
				_id,
				{
					$pull: { wishlist: productId },
				},
				{ new: true }
			);
		} else {
			updatedUser = await User.findByIdAndUpdate(
				_id,
				{
					$push: { wishlist: productId },
				},
				{ new: true }
			);
		}

		res.json(updatedUser);
	} catch (error) {}
});

// ratings
const rating = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	const { star, productId } = req.body;

	try {
		const product = await Product.findById(productId);
		const alreadyRated = product.ratings.find(
			(rating) => rating.postedBy.toString() === _id.toString()
		);

		if (alreadyRated) {
			const updateRating = await Product.updateOne(
				{
					ratings: { $elemMatch: alreadyRated },
				},
				{
					$set: { "ratings.$.star": star },
				},
				{ new: true }
			);
			res.json(updateRating);
		} else {
			const rateProduct = await Product.findByIdAndUpdate(
				productId,
				{ $push: { ratings: { star: star, postedBy: _id } } },
				{ new: true }
			);
			res.json(rateProduct);
		}
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
	addToWishlist,
	rating,
};
