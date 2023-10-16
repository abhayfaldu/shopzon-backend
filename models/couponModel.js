const mongoose = require("mongoose");

// Declare the Schema of the coupon model
var couponSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
		uppercase: true,
	},
	expiry: {
		type: Date,
		required: true,
	},
	discount: {
		type: Number,
		required: true,
	},
});

const couponModel = mongoose.model("Coupon", couponSchema);

//Export the model
module.exports = couponModel;
