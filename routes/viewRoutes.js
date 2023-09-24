const express = require('express');
const { getOVerview, getTours} = require('./../controllers/viewController')

const router = express();

router.get('/', getOVerview );

router.get('/tour', getTours );

module.exports = router;