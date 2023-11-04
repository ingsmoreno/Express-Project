const express = require('express');
const { getCheckoutSession, createBooking, getAllBookings, getOneBooking, updateOneBooking, deleteOneBooking } = require('../controllers/bookingController');
const {protect, restrictTo} = require('./../controllers/authController');

const router = express.Router();
router.use(protect);

router.route('/checkout-session/:tourId')
      .get(getCheckoutSession)

router.use(restrictTo('admin', 'lead-guide'));

router.route('/')
      .get(getAllBookings)
      .post(createBooking)


router.route('/:id')
      .get(getOneBooking)
      .patch(updateOneBooking)
      .delete(deleteOneBooking)

module.exports = router;