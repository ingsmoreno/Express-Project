const User = require('./../models/userModel');
const catchAsync = require("../utils/catchAsync");
const { deleteOne, updateOne, getOne, getAll } = require('./handlerFactory');

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
}

exports.getAllUsers = getAll(User);
exports.getOneUser = getOne(User);
exports.updateUser = updateOne(User); // REVIEW AUTHORIZATION, PASSWORD CANNOT BE UPDATED HERE! 
exports.deleteUserById = deleteOne(User);