const crypto = require("crypto");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");

const signToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

//  Creates JWT token
const createSendToken = (user, statusCode, req, res, message) => {
	const token = signToken(user._id);
	const cookieOptions = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
		),
		secure: false,
		httpOnly: true,
	};

	if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

	res.cookie("jwt", token);

	user.password = undefined;

	req.user = user;

	return res.status(statusCode).json({
		status: "success",
		message,
		token,
		data: {
			user,
		},
	});
};

// Validates user's passwords
exports.passwordCheck = (req, res, next) => {
	const { password, passwordConfirm } = req.body;

	if (password !== passwordConfirm) {
		return next(new appError("passwords do not match", 401));
	}

	return next();
};

// Middleware to check if the user is logged in
exports.isLoggedIn = catchAsync(async (req, res, next) => {
	// Get token and check of it's there
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		token = req.headers.authorization.split(" ")[1];
	} else if (req.cookies.jwt) {
		// Gets token from cookie if there is a cookie
		token = req.cookies.jwt;
	}

	if (!token) {
		return next(new appError("token is invalid.", 401));
	}

	// Verifcation token
	const decoded = await jwt.verify(token, process.env.JWT_SECRET);

	// Check if the user still exists
	const user = await User.findById(decoded.id);

	if (!user) {
		return next(new appError("User not found.", 401));
	}

	// User is logged in, store user data in request for later use
	req.user = user;

	next();
});

// Grants access to different type of users
exports.restrictTo = (roles) => {
	return (req, res, next) => {
		// console.log(roles, req.user.role);
		if (!roles.includes(req.user.role)) {
			return next(
				new appError(`You're not permitted to perform this action`, 400)
			);
		}
		next();
	};
};

// Registers a new user
exports.createUser = catchAsync(async (req, res, next) => {
	const newUser = new User(req.body);

	await newUser.save({ runValidators: true });

	let message = `Successfully signed up`

	res.status(201).json({
		status: "success",
		message,
	});
});

// Logs in users
exports.signIn = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json({
			status: "failed",
			message: "Please provide an email and password!",
		});
	}

	const user = await User.findOne({ email }).select("+password");

	// console.log(user);

	if (!user || !(await user.correctPassword(password, user.password))) {
		return next(new appError("Incorrect email or password.", 401));
	}

	const message = `You've successfully logged in.`

	createSendToken(user, 200, req, res, message);
});

// Middleware to apply for a password reset
exports.forgotPassword = catchAsync(async (req, res, next) => {
    const { email } = req.body
    // 1. find user using email
    const user = await User.findOne({email});

    if (!user) return next(new appError(`No user found with this ID`, 404))

    // 2. generate reset-token
    const token = await user.generateResetToken();
    await user.save({validateBeforeSave: false});

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/reset/${token}`;

    return res.status(200).json({
        status: 'success',
        message: `Link has been sent to your email. Url: ${resetUrl}`
    })
});

// Resets the user's password
exports.resetPassword = catchAsync(async (req, res, next) => {
    const { token } = req.params;
    const { password } = req.body;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // 1. verify if user token is valid3
    const user = await User.findOne({resetToken: hashedToken, resetExpires: {$gt: Date.now() }})

    if (!user) return next(new appError('Token is either invalid or expired'));

    // 2. set new password to user
    user.password = password;
    user.resetToken = undefined, user.resetExpires = undefined;
    await user.save();

    res.status(200).json({
        status: 'success',
        message: `password successfully resetted`
    })
})

exports.updatePassword = catchAsync(async (req, res, next) => {
    const { currentPassword, password } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if(!user && !(await user.correctPassword(currentPassword, user.password))) {
        return next(new appError(`Your current password is wrong.`, 401))
    }

    user.password = password;
    await user.save();

	const message = `You've successfully updated your password.`

	createSendToken(user, 200, req, res, message);
})


exports.addToCart = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    user.addToUserCart(req.body);

    res.status(200).json({
        status: 'success',
        data: {
            cart: user.cart
        }
    })
});

exports.getUserCart = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user._id).populate('cart.items.product');

    res.status(200).json({
        status: 'success',
        data: {
            cart: user.cart
        }
    })
});