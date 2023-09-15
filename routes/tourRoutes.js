const express = require('express');
const { getAllTours, createTour, getOneTour, updateTour, deleteTour, aliasTopTours, getTourStats, getMonthlyPlan } = require('./../controllers/tourController')
const { protect, restrictTo } = require('./../controllers/authController')
const reviewRouter  = require('./../routes/reviewRoutes');

const router = express.Router();

// router.param('id', checkId);

//POST tour/tourId/reviews
//GET tour/tourId/reviews
router.use('/:tourId/reviews', reviewRouter);

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
    .post(protect, createTour);

router
    .route('/:id')
    .get(getOneTour)
    .patch(updateTour)
    .delete(
        protect, 
        restrictTo('admin', 'lead-guide'), 
        deleteTour
    );

module.exports = router;