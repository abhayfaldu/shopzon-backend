const express = require("express");
const {
	createEnquiry,
	updateEnquiry,
	getAllEnquiries,
	deleteEnquiry,
	getASingleEnquiry,
} = require("../controllers/enquiryController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { isAdmin } = require("../middlewares/isAdmin.js");
const router = express.Router();

router.get("/", getAllEnquiries);
router.get("/:id", getASingleEnquiry);

router.post("/", createEnquiry);
router.put("/:id", authMiddleware, isAdmin, updateEnquiry);
router.delete("/:id", authMiddleware, isAdmin, deleteEnquiry);

module.exports = router;
