const express = require("express");
const {
	createUser,
	loginUserController,
	getAllUsers,
	getAUser,
	updateUser,
	deleteUser,
	blockUser,
	unblockUser,
} = require("../controllers/userController.js");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware.js");

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUserController);
router.get("/all-users", getAllUsers);
router.get("/:id", authMiddleware, isAdmin, getAUser);
router.delete("/:id", deleteUser);
router.put("/edit-user", authMiddleware, updateUser);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);

module.exports = router;
