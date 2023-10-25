const mongoose = require("mongoose");

var colorSchema = new mongoose.Schema(
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

const Color = mongoose.model("Color", colorSchema);

//Export the model
module.exports = Color;
