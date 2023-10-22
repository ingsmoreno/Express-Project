const express = require('express');
const { getAllUsers, getMe, getOneUser, updateUser, deleteUserById, updateMe, deleteMe, uploadUserPhoto } = require ('./../controllers/userController');
const { protect, restrictTo} = require('./../controllers/authController');

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getAllUsers);

router.route('/me')
    .get(getMe, getOneUser);

router.route('/updateMe')   
    .patch(uploadUserPhoto, updateMe);

router.route('/deleteMe')
    .delete(deleteMe);

router.use(restrictTo('admin'));

router.route('/:id')
    .get(getOneUser)
    .patch(updateUser)
    .delete(deleteUserById);

module.exports = router;