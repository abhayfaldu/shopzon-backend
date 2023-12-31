const mongoose = require("mongoose");

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema(
	{
		products: [
			{
				product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
				count: Number,
				color: String,
			},
		],
		paymentIntent: {},
		orderStatus: {
			type: String,
			default: "Not Processed",
			enum: [
				"Not Processed",
				"Cash on Delivery",
				"Processing",
				"Dispatched",
				"Cancelled",
				"Delivered",
			],
		},
		orderedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{
		timestamps: true,
	}
);

const orderModel = mongoose.model("Order", orderSchema);

//Export the model
module.exports = orderModel;
