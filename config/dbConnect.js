const {default: mongoose} = require("mongoose")
const dotenv = require("dotenv").config();

const dbConnect = () => {
  try{
    const connection = mongoose.connect(process.env.MONGODB_URL)
    console.log("Database connected successfully")
  }
  catch (error) {
    console.log("Database connection error")
    throw new Error(error);
  }
}
module.exports = dbConnect;
