const express = require('express');
const { getOVerview, getTours, getLogin, getMe} = require('./../controllers/viewController');
const { loggedIn, protect } = require('../controllers/authController');

const router = express();

router.get('/', loggedIn, getOVerview );

router.get('/tour/:slug', loggedIn, getTours)

router.get('/login',loggedIn, getLogin)

router.get('/me', protect, getMe)

module.exports = router;