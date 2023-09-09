const express = require('express');
const { getAllReviews, createReview } = require('../controllers/reviewController');
const {protect, restrictTo} = require('./../controllers/authController');

const router = express.Router()
router.route('/reviews')
    .get(getAllReviews)

router.route('/create-review')
    .post(
        protect, 
        restrictTo('user'), 
        createReview)

module.exports = router;