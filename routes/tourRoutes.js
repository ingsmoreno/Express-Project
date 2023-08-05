const express = require('express');
const { getAllTours, postTour, getTourById, patchTour,deleteTour, aliasTopTours, getTourStats, getMonthlyPlan } = require('./../controllers/tourController')

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
    .get(getAllTours)
    .post(postTour);

router
    .route('/:id')
    .get(getTourById)
    .patch(patchTour)
    .delete(deleteTour);

module.exports = router;