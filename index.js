const express = require("express");
const dotenv = require("dotenv").config();
const dbConnect = require("./config/dbConnect.js");
const authRoute = require("./routes/authRoutes.js");
const bodyParser = require("body-parser");
const { notFound, errorHandler } = require("./middlewares/errorHandler.js");
const cookieParser = require("cookie-parser");
const productRouter = require("./routes/productRoute.js");
const morgan = require("morgan");

const app = express();

dbConnect();

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/user", authRoute);
app.use("/api/product", productRouter);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
	console.log(`server is running at port: ${PORT}`);
});
