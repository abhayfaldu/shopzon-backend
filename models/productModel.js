const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		slug: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
		},
		description: {
			type: String,
			required: true,
		},
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Category",
		},
		brand: {
			type: String,
			enum: ["Apple", "Samsung", "Lenovo"],
		},
		sold: {
			type: Number,
			default: 0,
		},
		quantity: { type: Number, require: true },
		images: {
			type: Array,
		},
		color: {
			type: String,
			enum: ["Black", "Brown", "Red"],
		},
		ratings: [
			{
				star: Number,
				postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
			},
		],
	},
	{ timestamps: true }
);

//Export the model
module.exports = mongoose.model("Product", productSchema);
