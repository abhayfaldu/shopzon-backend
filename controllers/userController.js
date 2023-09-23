const { genToken } = require("../config/jwtToken.js");
const User = require("../models/userModel.js");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId.js");

// user register controller
const createUser = asyncHandler(async (req, res) => {
	const email = req.body.email;
	const findUser = await User.findOne({ email });

	if (!findUser) {
		// create a new user
		const newUser = await User.create(req.body);
		res.json(newUser);
	} else {
		// user already exists
		throw new Error("User Already Exists");
	}
});

// user login controller
const loginUserController = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	// check if user exists or not
	const findUser = await User.findOne({ email });
	if (findUser && (await findUser.isPasswordMatch(password))) {
		res.json({
			_id: findUser?._id,
			firstName: findUser?.firstName,
			lastName: findUser?.lastName,
			email: findUser?.email,
			mobile: findUser?.mobile,
			token: genToken(findUser?._id),
		});
	} else {
		throw new Error("Invalid credentials");
	}
});

// Get all users controller
const getAllUsers = asyncHandler(async (req, res) => {
	try {
		const users = await User.find();
		res.json(users);
	} catch (error) {
		throw new Error(error);
	}
});

// Get a single user controller
const getAUser = asyncHandler(async (req, res) => {
	const id = req.params.id;
	validateMongodbId(id);
	try {
		const user = await User.findById(id);
		res.json(user);
	} catch (error) {
		throw new Error(error);
	}
});

// Update user
const updateUser = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	validateMongodbId(_id);
	try {
		const newUserDetails = {
			firstName: req?.body?.firstName,
			lastName: req?.body?.lastName,
			email: req?.body?.email,
			mobile: req?.body?.mobile,
			password: req?.body?.password,
		};
		const updatedUser = await User.findByIdAndUpdate(_id, newUserDetails, {
			new: true,
		});
		res.json(updatedUser);
	} catch (error) {
		throw new Error(error);
	}
});

// delete user
const deleteUser = asyncHandler(async (req, res) => {
	const id = req.params.id;
	validateMongodbId(id);
	try {
		const deletedUser = await User.findByIdAndDelete(id);
		res.json(deletedUser);
	} catch (error) {
		throw new Error(error);
	}
});

// block a user
const blockUser = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	validateMongodbId(id);
	try {
		const block = await User.findByIdAndUpdate(
			id,
			{ isBlocked: true },
			{ new: true }
		);
		res.json(block);
	} catch (err) {
		throw new Error(err);
	}
});

// unblock a user
const unblockUser = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	validateMongodbId(id);
	try {
		const unblock = await User.findByIdAndUpdate(
			id,
			{ isBlocked: false },
			{ new: true }
		);
		res.json(unblock);
	} catch (err) {
		throw new Error(err);
	}
});

module.exports = {
	createUser,
	loginUserController,
	getAllUsers,
	getAUser,
	updateUser,
	deleteUser,
	blockUser,
	unblockUser,
};
