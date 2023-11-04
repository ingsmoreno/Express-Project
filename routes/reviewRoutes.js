const express = require('express');
const { getAllReviews, createReview, deleteReviewById, updateReviewById, setTourAndUser, getOneReview } = require('../controllers/reviewController');
const {protect, restrictTo} = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(protect);

router.route('/')
    .get(getAllReviews)
    .post( 
        restrictTo('user'), 
        setTourAndUser,
        createReview)

router.route('/:id') 
    .get(getOneReview)
    .patch(
        restrictTo('user'), // REVIEW TO UPDATE ONLY THE REVIEW THE USER CREATED
        updateReviewById)
    .delete(
        restrictTo('admin'), 
        deleteReviewById)

module.exports = router;