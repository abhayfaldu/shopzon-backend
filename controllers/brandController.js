const Brand = require("../models/brandModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");

// get all brands
const getAllBrands = asyncHandler(async (req, res) => {
	try {
		const brands = await Brand.find();
		res.json(brands);
	} catch (error) {
		throw new Error(error);
	}
});

// create brand
const createBrand = asyncHandler(async (req, res) => {
	try {
		const newBrand = await Brand.create(req.body);
		res.json(newBrand);
	} catch (error) {
		throw new Error(error);
	}
});

// update brand
const updateBrand = asyncHandler(async (req, res) => {
	const { id } = req.params;
	validateMongodbId(id);
	try {
		const updatedBrand = await Brand.findByIdAndUpdate(id, req.body, {
			new: true,
		});
		res.json(updatedBrand);
	} catch (error) {
		throw new Error(error);
	}
});

// delete brand
const deleteBrand = asyncHandler(async (req, res) => {
	const { id } = req.params;
	validateMongodbId(id);
	try {
		const deletedBrand = await Brand.findByIdAndDelete(id);
		res.json(deletedBrand);
	} catch (error) {
		throw new Error(error);
	}
});

// get a single brand
const getASingleBrand = asyncHandler(async (req, res) => {
	const { id } = req.params;
	validateMongodbId(id);
	try {
		const brand = await Brand.findById(id);
		res.json(brand);
	} catch (error) {
		throw new Error(error);
	}
});

module.exports = {
	getAllBrands,
	createBrand,
	updateBrand,
	deleteBrand,
	getASingleBrand,
};
