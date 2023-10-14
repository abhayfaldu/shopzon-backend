const ProductCategory = require("../models/productCategoryModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");

// get all categories
const getAllCategories = asyncHandler(async (req, res) => {
	try {
		const categories = await ProductCategory.find();
		res.json(categories);
	} catch (error) {
		throw new Error(error);
	}
});

// create category
const createCategory = asyncHandler(async (req, res) => {
	try {
		const newCategory = await ProductCategory.create(req.body);
		res.json(newCategory);
	} catch (error) {
		throw new Error(error);
	}
});

// update category
const updateCategory = asyncHandler(async (req, res) => {
	const { id } = req.params;
	validateMongodbId(id);
	try {
		const updatedCategory = await ProductCategory.findByIdAndUpdate(
			id,
			req.body,
			{
				new: true,
			}
		);
		res.json(updatedCategory);
	} catch (error) {
		throw new Error(error);
	}
});

// delete category
const deleteCategory = asyncHandler(async (req, res) => {
	const { id } = req.params;
	validateMongodbId(id);
	try {
		const deletedCategory = await ProductCategory.findByIdAndDelete(id);
		res.json(deletedCategory);
	} catch (error) {
		throw new Error(error);
	}
});

module.exports = {
	getAllCategories,
	createCategory,
	updateCategory,
	deleteCategory,
};
