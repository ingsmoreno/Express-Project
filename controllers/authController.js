const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');


const signToken = (userId) => {
    return jwt.sign({id: userId}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

exports.singup = catchAsync(async (req, res) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    }); 

    const token = signToken(newUser._id);

    res.status(201).json({
        status: 'sucess',
        data: {
            token,
            user: newUser
        }
    })
})


exports.login =  catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if(!email || !password) return next(new AppError('Please provide an email and password', 400));
                                            // select: false in userModels
    const user = await User.findOne({email}).select('+password');
    const correct = await user.correctPassword(password, user.password);

    if(!user || !correct) return next(new AppError('Incorrect password or email', 401));

    const token = signToken(user._id);

    res.status(201).json({
        status: 'sucess',
        token
    })

})