const express = require('express');
const { getAllUsers, getMe, getOneUser, updateUser, deleteUserById} = require ('./../controllers/userController');
const { protect, restrictTo } = require('./../controllers/authController')

const router = express.Router();

router.route('/')
    .get(getAllUsers);

router.route('/me')
    .get(protect, getMe, getOneUser);

router.route('/:id')
    .get(getOneUser)
    .patch(updateUser)
    .delete(protect, restrictTo('admin'), deleteUserById);

module.exports = router;