const express = require('express');
const { singup, login, forgotPassword, resetPassword, updatePassword, protect, updateMe, deleteMe } = require('./../controllers/authController');

const router = express.Router();

router.route('/forgotPassword')
    .post(forgotPassword);

router.route('/resetPassword/:token')
    .patch(resetPassword);

router.route('/signup')
    .post(singup);

router.route('/login')
    .post(login);

router.use(protect)

router.route('/updatePassword')
        .patch(updatePassword);

module.exports = router;