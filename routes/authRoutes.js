const express = require("express");
const router = express.Router();
const {
	createUser,
	loginUserController,
	getAllUsers,
	getAUser,
	updateUser,
	deleteUser,
} = require("../controllers/userController.js");

router.post("/register", createUser);
router.post("/login", loginUserController);
router.get("/all-users", getAllUsers);
router.get("/:id", getAUser);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
