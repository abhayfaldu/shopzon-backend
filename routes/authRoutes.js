const express = require("express");
const {
	createUser,
	loginUserController,
	getAllUsers,
	getASingleUser,
	updateUser,
	deleteUser,
	blockUser,
	unblockUser,
	handleRefreshToken,
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
	createOrder,
} = require("../controllers/userController.js");
const { authMiddleware } = require("../middlewares/authMiddleware.js");
const { isAdmin } = require("../middlewares/isAdmin.js");

const router = express.Router();

router.delete("/empty-cart", authMiddleware, emptyCart);
router.post("/register", createUser);
router.post("/forgot-password-token", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);
router.post("/login", loginUserController);
router.post("/admin-login", adminLogin);
router.get("/all-users", getAllUsers);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);
router.delete("/:id", deleteUser);

router.put("/update-password", authMiddleware, updatePassword);
router.put("/edit-user", authMiddleware, updateUser);
router.get("/wishlist", authMiddleware, getWishlist);
router.put("/save-address", authMiddleware, saveAddress);
router.post("/add-to-cart", authMiddleware, userCart);
router.get("/cart", authMiddleware, getUserCart);
router.post("/cart/apply-coupon", authMiddleware, applyCoupon);
router.post("/cart/cash-order", authMiddleware, createOrder);

router.get("/:id", authMiddleware, isAdmin, getASingleUser);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);

module.exports = router;
