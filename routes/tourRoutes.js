const express = require('express');
const { getAllTours, createTour, getOneTour, updateTour, deleteTour, aliasTopTours, getTourStats, getMonthlyPlan, geospatialWithin, distances } = require('./../controllers/tourController')
const { protect, restrictTo } = require('./../controllers/authController')
const reviewRouter  = require('./../routes/reviewRoutes');

const router = express.Router();

router.use(protect);

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
    .route('/geo-within/:distance/center/:latlng/unit/:unit')
    .get(geospatialWithin);

router
    .route('/distances/:latlng/unit/:unit')
    .get(distances);

router
    .route('/')
    .get(getAllTours)
    .post(restrictTo('admin', 'lead-guide'), createTour);

router
    .route('/:id')
    .get(getOneTour)
    .patch(restrictTo('admin', 'lead-guide'), updateTour)
    .delete( 
        restrictTo('admin', 'lead-guide'), 
        deleteTour
    );

module.exports = router;