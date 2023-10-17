const Product = require("../models/productModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const validateMongoDbId = require("../utils/validateMongodbId");
const cloudinaryUploadImg = require("../utils/cloudinary");
const fs = require("fs");
const validateMongodbId = require("../utils/validateMongodbId");

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
	validateMongodbId(id)

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
	validateMongodbId(id)

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
	validateMongodbId(id)

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
	validateMongodbId(_id)

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
	validateMongodbId(_id)

	const { star, comment, productId } = req.body;

	try {
		const product = await Product.findById(productId);
		const alreadyRated = product.ratings.find(
			(rating) => rating.postedBy.toString() === _id.toString()
		);

		if (alreadyRated) {
			await Product.updateOne(
				{
					ratings: { $elemMatch: alreadyRated },
				},
				{
					$set: { "ratings.$.star": star, "ratings.$.comment": comment },
				},
				{ new: true }
			);
		} else {
			await Product.findByIdAndUpdate(
				productId,
				{
					$push: {
						ratings: {
							star: star,
							comment: comment,
							postedBy: _id,
						},
					},
				},
				{ new: true }
			);
		}

		// average rating
		let totalNumberOfRatings = product.ratings.length;

		let sumOfNumberOfStars = product.ratings
			.map((rating) => rating.star)
			.reduce((prev, curr) => prev + curr, 0);

		let averageRating = Math.round(sumOfNumberOfStars / totalNumberOfRatings);

		let updatedRating = await Product.findByIdAndUpdate(
			productId,
			{ averageRating: averageRating },
			{ new: true }
		);
		res.json(updatedRating);
	} catch (error) {
		throw new Error(error);
	}
});

// upload images
const uploadImages = asyncHandler(async (req, res) => {
	const { id } = req.params;
	validateMongoDbId(id);

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
		const updatedProduct = await Product.findByIdAndUpdate(
			id,
			{ images: urls.map((file) => file) },
			{ new: true }
		);
		res.json(updatedProduct);
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
	uploadImages,
};
