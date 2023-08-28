const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

exports.singup = catchAsync(async (req, res) => {
    const newUser = await User.create(req.body); 

    res.status(201).json({
        status: 'sucess',
        data: {
            user: newUser
        }
    })
})

exports.getAllUsers = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'method not defined'
    })
} 

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
