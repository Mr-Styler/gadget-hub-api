const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");

const allowedOrigins = [
	"http://localhost:3000"
];
const corsOptions = {
	origin: allowedOrigins,
};

// Route declaration
const appError = require("./utils/appError");
const errorController = require("./controllers/errorController");
const authController = require("./controllers/authController");
const userRoute  = require("./routes/userRoute");
const orderRoute  = require("./routes/orderRoute");
const reviewRoute  = require("./routes/reviewRoute");
const productRoute  = require("./routes/productRoute");

// Port 443 is for https
// Port 80 is for http
app.use(cors(corsOptions));
app.use(express.static(__dirname + "/public"));
app.use((req, res, next) => {
	const origin = req.headers.origin;

	if (allowedOrigins.includes(origin)) {
		res.setHeader("Access-Control-Allow-Origin", origin);
	}

	res.header(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, DELETE, OPTIONS, PATCH"
	);
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	next();
});
app.options("/api/v1", cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(__dirname + "/public"));

// Authentication Routes
app.post(
	"/api/v1/signup",
	authController.passwordCheck,
	authController.createUser
);
app.post("/api/v1/signin", authController.signIn);
app.post("/api/v1/forgot-password", authController.forgotPassword);
app.patch(
	"/api/v1/reset/:token",
    authController.passwordCheck,
	authController.resetPassword
);

// Logged In Routes
app.use('/api/v1/users', userRoute)
app.use('/api/v1/products', productRoute)
app.use('/api/v1/reviews', reviewRoute)
app.use('/api/v1/orders', orderRoute)

// Today's Work: Error Handling
app.all("*", (req, res, next) => {
    return next(
        new appError(`Can't ${req.method} ${req.originalUrl} route on this server.`, 400)
      );
    });

app.use(errorController);

module.exports = app;
