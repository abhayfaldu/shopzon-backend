const express = require("express");
const {
	createProduct,
	getASingleProduct,
	getAllProducts,
} = require("../controllers/productController");
const router = express.Router();

router.post("/", createProduct);
router.get("/:id", getASingleProduct);
router.get("/", getAllProducts);

module.exports = router;
