const express = require('express');
const { getAllUsers, createUser, getUserById, updateUserById, deleteUserById} = require ('./../controllers/userController');
const { protect, restrictTo } = require('./../controllers/authController')

const router = express.Router();

router.route('/')
    .get(getAllUsers)
    .post(createUser);

router.route('/:id')
    .get(getUserById)
    .patch(updateUserById)
    .delete(protect, restrictTo('admin'), deleteUserById);

module.exports = router;