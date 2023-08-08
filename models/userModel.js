const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Declare the schema of the mongo model
const userSchema = new mongoose.Schema(
	{
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		mobile: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		role: { type: String, default: "user" },
	},
	{ versionKey: false }
);

userSchema.pre("save", async function (next) {
	const salt = await bcrypt.genSaltSync(10);
	this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.isPasswordMatch = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

// Declare the model
const userModel = mongoose.model("user", userSchema);

// Export the modal
module.exports = userModel;
