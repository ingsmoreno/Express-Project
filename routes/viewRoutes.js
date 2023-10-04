const express = require('express');
const { getOVerview, getTours, getLogin} = require('./../controllers/viewController');
const { protect } = require('../controllers/authController');

const router = express();

router.get('/', getOVerview );

router.get('/tour/:slug', protect, getTours)

router.get('/login', getLogin)

module.exports = router;