const mongoose = require("mongoose");

// Declare the Schema of the Mongo model
var cartSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
		index: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	mobile: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
});

const cartModel = mongoose.model("Cart", cartSchema);

//Export the model
module.exports = cartModel;
