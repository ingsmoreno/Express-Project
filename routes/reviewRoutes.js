const express = require('express');
const { getAllReviews, createReview, deleteReviewById } = require('../controllers/reviewController');
const {protect, restrictTo} = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router.route('/')
    .get(getAllReviews)
    .post(
        protect, 
        restrictTo('user'), 
        createReview)

router.route('/:id')
    .delete(
        protect, 
        restrictTo('admin'), 
        deleteReviewById)

module.exports = router;