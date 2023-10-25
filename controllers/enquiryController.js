const Enquiry = require("../models/enquiryModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");

// get all enquiries
const getAllEnquiries = asyncHandler(async (req, res) => {
	try {
		const enquiries = await Enquiry.find();
		res.json(enquiries);
	} catch (error) {
		throw new Error(error);
	}
});

// create enquiry
const createEnquiry = asyncHandler(async (req, res) => {
	try {
		const newInquiry = await Enquiry.create(req.body);
		res.json(newInquiry);
	} catch (error) {
		throw new Error(error);
	}
});

// update enquiry
const updateEnquiry = asyncHandler(async (req, res) => {
	const { id } = req.params;
	validateMongodbId(id);

	try {
		const updatedEnquiry = await Enquiry.findByIdAndUpdate(id, req.body, {
			new: true,
		});
		res.json(updatedEnquiry);
	} catch (error) {
		throw new Error(error);
	}
});

// delete enquiry
const deleteEnquiry = asyncHandler(async (req, res) => {
	const { id } = req.params;
	validateMongodbId(id);

	try {
		const deletedEnquiry = await Enquiry.findByIdAndDelete(id);
		res.json(deletedEnquiry);
	} catch (error) {
		throw new Error(error);
	}
});

// get a single enquiry
const getASingleEnquiry = asyncHandler(async (req, res) => {
	const { id } = req.params;
	validateMongodbId(id);

	try {
		const enquiry = await Enquiry.findById(id);
		res.json(enquiry);
	} catch (error) {
		throw new Error(error);
	}
});

module.exports = {
	getAllEnquiries,
	createEnquiry,
	updateEnquiry,
	deleteEnquiry,
	getASingleEnquiry,
};
