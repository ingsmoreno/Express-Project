const express = require('express');
const { getAllTours, postTour, getTourById, patchTour, deleteTour, aliasTopTours, getTourStats, getMonthlyPlan } = require('./../controllers/tourController')
const { protect, restrictTo } = require('./../controllers/authController')
const { createReview } = require('./../controllers/reviewController');

const router = express.Router();

// router.param('id', checkId);

router
    .route('/tour-stats')
    .get(getTourStats);

router
    .route('/monthly-plan/:year')
    .get(getMonthlyPlan);

router
    .route('/top-5-cheap')
    .get(aliasTopTours, getAllTours);

router
    .route('/')
    .get(protect, getAllTours)
    .post(protect, postTour);

router
    .route('/:id')
    .get(getTourById)
    .patch(patchTour)
    .delete(
        protect, 
        restrictTo('admin', 'lead-guide'), 
        deleteTour
    );

//POST tour/tourId/reviews
//GET tour/tourId/reviews

router.route('/:tourId/review')
    .post(protect, restrictTo('user'), createReview )

module.exports = router;