const express = require('express');
const { getOVerview, getTours, getLogin} = require('./../controllers/viewController')

const router = express();

router.get('/', getOVerview );

router.get('/tour/:slug', getTours)

router.get('/login', getLogin)

module.exports = router;