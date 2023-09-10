const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Reviews = require('./../models/reviewModel');

exports.createReview = catchAsync( async (req, res, next) => {
    if(!req.body.tour) req.body.tour = req.params.tourId;
    if(!req.body.user) req.body.user = req.user.id;
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