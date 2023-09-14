const express = require('express');
const { getAllReviews, createReview, deleteReviewById, updateReviewById, setTourAndUser } = require('../controllers/reviewController');
const {protect, restrictTo} = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router.route('/')
    .get(getAllReviews)
    .post(
        protect, 
        restrictTo('user'), setTourAndUser,
        createReview)

router.route('/:id')
    .patch(protect, restrictTo('user'),  updateReviewById)
    .delete(
        protect, 
        restrictTo('admin'), 
        deleteReviewById)

module.exports = router;