const express = require('express');
const { singup, login } = require('./../controllers/authController');

const router = express.Router();

router.route('/signup')
    .post(singup);

router.route('/login')
    .post(login);


module.exports = router;