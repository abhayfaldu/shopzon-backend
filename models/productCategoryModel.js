const mongoose = require("mongoose");

var CategorySchema = new mongoose.Schema(
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

const Category = mongoose.model("ProductCategory", CategorySchema);

//Export the model
module.exports = Category;
