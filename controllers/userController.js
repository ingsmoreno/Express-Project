const User = require('./../models/userModel');
const catchAsync = require("../utils/catchAsync");

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

exports.updateUserById = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'method not defined'
    })
} 

exports.deleteUserById = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'method not defined'
    })
} 
