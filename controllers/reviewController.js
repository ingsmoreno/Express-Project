const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Reviews = require('./../models/reviewModel');
const { deleteOne, updateOne, createOne, getOne, getAll } = require('./handlerFactory');

exports.setTourAndUser = (req, res, next) => {
   if(!req.body.tour) req.body.tour = req.params.tourId;
   if(!req.body.user) req.body.user = req.user.id;
   next();
}

exports.getAllReviews = getAll(Reviews);
exports.getOneReview = getOne(Reviews);
exports.createReview = createOne(Reviews);
exports.updateReviewById = updateOne(Reviews);
exports.deleteReviewById = deleteOne(Reviews);