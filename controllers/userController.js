const User = require('./../models/userModel');
const catchAsync = require("../utils/catchAsync");
const { deleteOne, updateOne, getOne, getAll } = require('./handlerFactory');

exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'method not defined'
    })
} 

exports.getAllUsers = getAll(User);
exports.getOneUser = getOne(User);
exports.updateUser = updateOne(User); // REVIEW AUTHORIZATION, PASSWORD CANNOT BE UPDATED HERE! 
exports.deleteUserById = deleteOne(User);