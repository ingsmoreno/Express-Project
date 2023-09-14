const express = require('express');
const { getAllUsers, createUser, getUserById, updateUser, deleteUserById} = require ('./../controllers/userController');
const { protect, restrictTo } = require('./../controllers/authController')

const router = express.Router();

router.route('/')
    .get(getAllUsers)
    .post(createUser);

router.route('/:id')
    .get(getUserById)
    .patch(updateUser)
    .delete(protect, restrictTo('admin'), deleteUserById);

module.exports = router;