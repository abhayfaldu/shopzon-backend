const mongoose = require("mongoose");

var brandSchema = new mongoose.Schema(
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

const Brand = mongoose.model("Brand", brandSchema);

//Export the model
module.exports = Brand;
