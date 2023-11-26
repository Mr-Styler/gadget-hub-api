const crudFunc = require("../utils/CRUD");
const Review = require("../models/reviewModel");

exports.getAllReview = crudFunc.getAll(Review);

exports.getReview = crudFunc.getOne(Review);

exports.createReview = crudFunc.createNew(Review);

exports.updateReview = crudFunc.updateOne(Review);

exports.deleteReview = crudFunc.deleteOne(Review);