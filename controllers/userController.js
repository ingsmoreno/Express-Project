const User = require('./../models/userModel');
const catchAsync = require("../utils/catchAsync");
const { deleteOne, updateOne } = require('./handlerFactory');

exports.getAllUsers = catchAsync( async (req, res) => {

      const user = await User.find()

        res.status(200).json({
            status: 'success',
            data: {
                user
            },
            results: user.length,
        })
})

exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'method not defined'
    })
} 

exports.getUserById = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'method not defined'
    })
} 

exports.updateUser = updateOne(User); // REVIEW AUTHORIZATION, PASSWORD CANNOT BE UPDATED HERE! 
exports.deleteUserById = deleteOne(User);