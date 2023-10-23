const User = require("../models/userModel.js");
const asyncHandler = require("express-async-handler");

// middleware to check if the user is admin or not
const isAdmin = asyncHandler(async (req, res, next) => {
	const { email } = req.user;
	const adminUser = await User.findOne({ email });
	if (adminUser?.role !== "admin") {
		throw new Error("You are not an admin");
	} else {
		next();
	}
});

module.exports = { isAdmin };
