const { generateToken } = require("../config/jwtToken.js");
const User = require("../models/userModel.js");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId.js");
const { generateRefreshToken } = require("../config/refreshToken.js");
const jwt = require("jsonwebtoken");

// user register controller
const createUser = asyncHandler(async (req, res) => {
	const email = req.body.email;
	const findUser = await User.findOne({ email });

	if (!findUser) {
		// create a new user
		const newUser = await User.create(req.body);
		res.json(newUser);
	} else {
		throw new Error("User Already Exists");
	}
});

// user login controller
const loginUserController = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	// check if user exists or not
	const findUser = await User.findOne({ email });
	if (findUser && (await findUser.isPasswordMatch(password))) {
		// generate refresh token
		const refreshToken = await generateRefreshToken(findUser?._id);

		// update user token
		const updateUserToken = await User.findByIdAndUpdate(
			findUser?.id,
			{ refreshToken },
			{ new: true }
		);

		// max age of cookie is set to 24 hours in milliseconds
		const maxAgeOfCookie = 1000 * 60 * 60 * 72;

		// store in cookie
		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			maxAge: maxAgeOfCookie,
		});

		res.json({
			_id: findUser?._id,
			firstName: findUser?.firstName,
			lastName: findUser?.lastName,
			email: findUser?.email,
			mobile: findUser?.mobile,
			token: generateToken(findUser?._id),
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
const getASingleUser = asyncHandler(async (req, res) => {
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

// handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
	const cookie = req.cookies;
	if (!cookie.refreshToken) {
		throw new Error("No refresh token in cookies");
	}

	const refreshToken = cookie.refreshToken;
	const user = await User.findOne({ refreshToken });
	if (!user) {
		throw new Error("No refresh token present in db or not matched");
	}

	// verify the token with jwt
	jwt.verify(refreshToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
		if (err || user.id !== decoded.id) {
			throw new Error("There is something wrong with refresh token");
		}

		const accessToken = generateToken(user?._id);
		res.json({ accessToken });
	});
});

// logout user
const logout = asyncHandler(async (req, res) => {
	const cookie = req.cookies;
	if (!cookie.refreshToken) {
		throw new Error("No refresh token in cookies");
	}

	const refreshToken = cookie.refreshToken;
	const user = await User.findOne({ refreshToken });
	if (user) {
		res.clearCookie("refreshToken", { httpOnly: true, secure: true });
		res.sendStatus(204); // forbidden
	}

	await User.findOneAndUpdate(refreshToken, { refreshToken: "" });
	res.clearCookie("refreshToken", { httpOnly: true, secure: true });
	res.sendStatus(204); // forbidden
});

module.exports = {
	createUser,
	loginUserController,
	handleRefreshToken,
	getAllUsers,
	getASingleUser,
	updateUser,
	deleteUser,
	blockUser,
	unblockUser,
	logout,
};
