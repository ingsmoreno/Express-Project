const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');
const catchAsync = require('./../utils/catchAsync');

exports.singup = catchAsync(async (req, res) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    }); 

    const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })

    res.status(201).json({
        status: 'sucess',
        data: {
            token,
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
