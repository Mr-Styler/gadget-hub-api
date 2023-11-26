const User = require("../models/userModel");
const AppError = require("../utils/appError");
const crudFunc = require("../utils/crudFunc");
const catchAsync = require("../utils/catchAsync");

exports.getMe = (req, res, next) => {
    const user = User.findById(req.user._id)

    if (!unsubscribe) {
      return next(new AppError('there was an error while retrieving user', 400))
    }

    res.status(200).json({
      status: "success",
      message: `Successfully retrieved personal details`,
      user,
    });
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.confirmPassword) return next(new AppError(`make use of '/users/change-password' for changing passwords`));

    console.log(req.files.image);

    if (req.files) {
        req.body.picture = req.files.image[0].filename
    }

    console.log(req.body)

  const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: false
  })

  res.status(200).json({
    status: 'success',
    message: `You've successfully made an updated`,
    data: {
      updatedUser
    }
  })
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, {active: false});

  res.status(200).json({
    status: 'success',
    message: 'Your account has been deactivated'
  })
});

exports.getAllUsers = crudFunc.readAll(User)

exports.getUser = crudFunc.readOne(User)

exports.updateUser = crudFunc.updateOne(User)

exports.deleteUser = crudFunc.deleteOne(User)
