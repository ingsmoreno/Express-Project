const express = require('express');
const { getAllUsers, createUser, getUserById, updateUserById, deleteUserById, singup } = require ('./../controllers/userController')

const router = express.Router();

router.route('/signup')
    .post(singup)

router.route('/')
    .get(getAllUsers)
    .post(createUser);

router.route('/:id')
    .get(getUserById)
    .patch(updateUserById)
    .delete(deleteUserById);

module.exports = router;