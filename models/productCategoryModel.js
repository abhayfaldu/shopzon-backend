const mongoose = require("mongoose");

var productCategorySchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			unique: true,
			index: true,
		},
	},
	{
		timestamps: true,
	}
);

const productCategoryModel = mongoose.model(
	"ProductCategory",
	productCategorySchema
);

//Export the model
module.exports = productCategoryModel;
