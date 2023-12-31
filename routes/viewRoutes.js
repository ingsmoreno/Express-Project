const express = require('express');
const { getOVerview, getTours, getLogin, getMe, updatingUserData, myTours} = require('./../controllers/viewController');
const { loggedIn, protect } = require('../controllers/authController');
const { createBookingCheckout } = require('../controllers/bookingController');

const router = express();

router.get('/', createBookingCheckout, loggedIn, getOVerview );

router.get('/tour/:slug', loggedIn, getTours);

router.get('/login', loggedIn, getLogin);

router.get('/me', protect, getMe);

router.post('/submit-user-data',protect, updatingUserData );

router.get('/my-tours', protect, myTours);


module.exports = router;