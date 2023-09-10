const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Reviews = require('./../models/reviewModel');

exports.createReview = catchAsync( async (req, res, next) => {
    const newReview = await Reviews.create({
        review: req.body.review,
        rating: req.body.rating,
        tour: req.body.tour,
        user: req.body.user
    })
 
    res.status(200).json({
         status: 'success',
         reponse: newReview
    })
 
 })

exports.getAllReviews = catchAsync( async (req, res, next) => {
   const reviews = await Reviews.find();

   res.status(200).json({
        status: 'success',
        data: reviews
   })

})