const express = require('express');
const { singup, login, forgotPassword } = require('./../controllers/authController');

const router = express.Router();

router.route('/forgotPassword')
    .post(forgotPassword);

router.route('/resetPassword/:token')
    .post(resetPassword);

router.route('/signup')
    .post(singup);

router.route('/login')
    .post(login);


module.exports = router;