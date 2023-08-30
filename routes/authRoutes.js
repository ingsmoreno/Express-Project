const express = require('express');
const { singup, login, forgotPassword, resetPassword, updatePassword, protect, updateMe } = require('./../controllers/authController');

const router = express.Router();

router.route('/updatePassword')
    .patch(protect, updatePassword);

router.route('/updateMe')
    .patch(protect, updateMe);

router.route('/forgotPassword')
    .post(forgotPassword);

router.route('/resetPassword/:token')
    .patch(resetPassword);

router.route('/signup')
    .post(singup);

router.route('/login')
    .post(login);


module.exports = router;