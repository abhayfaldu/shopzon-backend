const { generateToken } = require("../config/jwtToken.js");
const Coupon = require("../models/couponModel.js");
const User = require("../models/userModel.js");
const Product = require("../models/productModel.js");
const Cart = require("../models/cartModel.js");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId.js");
const { generateRefreshToken } = require("../config/refreshToken.js");
const jwt = require("jsonwebtoken");
const sendEmail = require("./emailController.js");
const crypto = require("crypto");

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

// admin login
const adminLogin = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	// check if admin exists or not
	const findAdmin = await User.findOne({ email });

	if (findAdmin.role !== "admin") throw new Error("Not Authorized");

	if (findAdmin && (await findAdmin.isPasswordMatch(password))) {
		// generate refresh token
		const refreshToken = await generateRefreshToken(findAdmin?._id);

		// update admin token
		const updateAdminToken = await User.findByIdAndUpdate(
			findAdmin?.id,
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
			_id: findAdmin?._id,
			firstName: findAdmin?.firstName,
			lastName: findAdmin?.lastName,
			email: findAdmin?.email,
			mobile: findAdmin?.mobile,
			token: generateToken(findAdmin?._id),
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

// update password
const updatePassword = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	validateMongodbId(_id);

	const { password } = req.body;

	const user = await User.findById(_id);
	if (password) {
		user.password = password;
		const updatedPassword = await user.save();
		res.json(updatedPassword);
	} else {
		res.json(user);
	}
});

const forgotPasswordToken = asyncHandler(async (req, res) => {
	const { email } = req.body;
	const user = await User.findOne({ email });
	if (!user) {
		throw new Error("user not found with this email");
	}
	try {
		const token = await user.createPasswordResetToken();
		await user.save();

		const PORT = process.env.PORT || 4001;
		const resetURL = `Hi, Please follow this link to reset your Password. This link is valid till 10 minutes from now. <a href="http://localhost:${PORT}/api/user/reset-password/${token}">Click Here</a>`;

		const data = {
			to: email,
			text: "Hey User",
			subject: "Forgot password link",
			html: resetURL,
		};

		sendEmail(data);
		res.json(token);
	} catch (error) {
		throw new Error(error);
	}
});

const resetPassword = asyncHandler(async (req, res) => {
	const { password } = req.body;
	const { token } = req.params;
	const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
	const user = await User.findOne({
		passwordResetToken: hashedToken,
		passwordResetExpires: { $gt: Date.now() },
	});
	if (!user) {
		throw new Error("Token Expired, Please try again later");
	}
	user.password = password;
	user.passwordResetToken = undefined;
	user.passwordResetExpires = undefined;

	await user.save();
	res.json(user);
});

// get wishlist
const getWishlist = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	validateMongodbId(_id);

	try {
		const user = await User.findById(_id).populate("wishlist");
		res.json(user);
	} catch (error) {
		throw new Error(error);
	}
});

// save user address
const saveAddress = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	validateMongodbId(_id);

	try {
		const updatedUser = await User.findByIdAndUpdate(
			_id,
			{ address: req?.body?.address },
			{ new: true }
		);
		res.json(updatedUser);
	} catch (error) {
		throw new Error(error);
	}
});

// user cart feature
const userCart = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	validateMongodbId(_id);

	const { cart } = req.body;

	try {
		let products = [];
		const user = await User.findById(_id);

		// check if user already have products in cart
		const productAlreadyExistsInCart = await Cart.findOne({
			orderedBy: user._id,
		});

		if (productAlreadyExistsInCart) {
			productAlreadyExistsInCart.remove();
		}

		for (let i = 0; i < cart.length; i++) {
			const getPrice = await Product.findById(cart[i]._id)
				.select("price")
				.exec();

			const newProductToAdd = {
				product: cart[i]._id,
				count: cart[i].count,
				color: cart[i].color,
				price: getPrice.price,
			};

			products.push(newProductToAdd);
		}

		const cartTotal = products.reduce(
			(prev, curr) => prev + curr.price * curr.count,
			0
		);

		const newCart = await new Cart({
			products,
			cartTotal,
			orderedBy: user?._id,
		}).save();

		res.send(newCart);
	} catch (error) {
		throw new Error(error);
	}
});

// get user cart
const getUserCart = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	console.log("first");
	validateMongodbId(_id);

	try {
		const cart = await Cart.findOne({ orderedBy: _id }).populate(
			"products.product"
		);
		res.json(cart);
	} catch (error) {
		throw new Error(error);
	}
});

// empty cart
const emptyCart = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	validateMongodbId(_id);

	try {
		const user = await User.findOne({ _id });
		const cart = await Cart.findOneAndRemove({ orderedBy: user._id });
		res.json(cart);
	} catch (error) {
		throw new Error(error);
	}
});

// apply coupon
const applyCoupon = asyncHandler(async (req, res) => {
	const { coupon } = req.body;
	const validCoupon = await Coupon.findOne({ name: coupon });
	if (validCoupon === null) {
		throw new Error("Invalid Coupon");
	}

	const { _id } = req.user;
	validateMongodbId(_id);
	const user = await User.findById(_id);
	const { cartTotal } = await Cart.findOne({ orderedBy: user._id });
	const totalAfterDiscount =
		cartTotal - ((cartTotal * validCoupon.discount) / 100).toFixed(2);

	await Cart.findOneAndUpdate(
		{ orderedBy: user._id },
		{ totalAfterDiscount },
		{ new: true }
	);
	res.json(totalAfterDiscount);
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
	updatePassword,
	forgotPasswordToken,
	resetPassword,
	adminLogin,
	getWishlist,
	saveAddress,
	userCart,
	getUserCart,
	emptyCart,
	applyCoupon,
};
