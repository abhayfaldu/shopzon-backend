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
} = require("../controllers/userController.js");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware.js");

const router = express.Router();

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
router.post("/cart", authMiddleware, userCart);

router.get("/:id", authMiddleware, isAdmin, getASingleUser);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);

module.exports = router;
