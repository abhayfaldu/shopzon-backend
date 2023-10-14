const ProductCategory = require("../models/productCategoryModel");
const asyncHandler = require("express-async-handler");

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
	try {
		const updatedCategory = await ProductCategory.findById(id, req.body, {
			new: true,
		});
		res.json(updatedCategory);
	} catch (error) {
		throw new Error(error);
	}
});

module.exports = { createCategory, updateCategory };
