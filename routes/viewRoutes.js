const express = require('express');
const { getOVerview, getTours, getLogin} = require('./../controllers/viewController');
const { loggedIn, protect } = require('../controllers/authController');

const router = express();

router.use(loggedIn)

router.get('/', getOVerview );

router.get('/tour/:slug', protect, getTours)

router.get('/login', getLogin)

module.exports = router;