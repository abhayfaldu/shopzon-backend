const Color = require("../models/colorModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");

// get all colors
const getAllColors = asyncHandler(async (req, res) => {
	try {
		const colors = await Color.find();
		res.json(colors);
	} catch (error) {
		throw new Error(error);
	}
});

// create color
const createColor = asyncHandler(async (req, res) => {
	try {
		const newColor = await Color.create(req.body);
		res.json(newColor);
	} catch (error) {
		throw new Error(error);
	}
});

// update color
const updateColor = asyncHandler(async (req, res) => {
	const { id } = req.params;
	validateMongodbId(id);

	try {
		const updatedColor = await Color.findByIdAndUpdate(id, req.body, {
			new: true,
		});
		res.json(updatedColor);
	} catch (error) {
		throw new Error(error);
	}
});

// delete color
const deleteColor = asyncHandler(async (req, res) => {
	const { id } = req.params;
	validateMongodbId(id);

	try {
		const deletedColor = await Color.findByIdAndDelete(id);
		res.json(deletedColor);
	} catch (error) {
		throw new Error(error);
	}
});

// get a single color
const getASingleColor = asyncHandler(async (req, res) => {
	const { id } = req.params;
	validateMongodbId(id);

	try {
		const color = await Color.findById(id);
		res.json(color);
	} catch (error) {
		throw new Error(error);
	}
});

module.exports = {
	getAllColors,
	createColor,
	updateColor,
	deleteColor,
	getASingleColor,
};
