const AppError = require("./../utils/appError");

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(" ")}`;
  return new AppError(message, 400);
};

const handleDuplicateErrorDB = (err) => {
  const names = Object.keys(err.keyValue);
  console.log(names);
  const value = Object.values(err.keyValue);
  const message = `Duplicate ${names[0]} value: ${value}, please use another value!`;
  return new AppError(message, 400);
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleJWTErrorDB = (err) => {
  return new AppError("Invalid token. Please log in again!", 401);
};

const handleJWTexpiredErrorDB = (err) => {
  return new AppError("Your token has expired! Please log in again.", 401);
};

const SendErrorDev = (err, res) => {
  res.status(err.statusCode || 500).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const SendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.log("error", err);
    res.status(500).json({
      status: "error",
      error: err,
      message: "Something went wrong",
    });
  }
};

module.exports = (err, req, res, next) => {

  if (process.env.NODE_ENV === "development") {
    SendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    if (err.name === "ValidationError") err = handleValidationErrorDB(err);
    if (err.code === 11000) err = handleDuplicateErrorDB(err);
    if (err.name === "CastError") err = handleCastErrorDB(err);
    if (err.name === "JsonWebTokenError") err = handleJWTErrorDB(err);
    if (err.name === "TokenExpiredError") err = handleJWTexpiredErrorDB(err);

    SendErrorProd(err, res);
  }
};
