const { promisify } = require('util');
const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');


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
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt,
        role: req.body.role
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

});

exports.protect = catchAsync (async (req, res, next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }

    if(!token) return next(new AppError('Please provide a Token', 401));

    // Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
   
    // Check if user still exist
    const currentUser = await User.findById(decoded.id);
    if(!currentUser) return next(new AppError('This token does not longer exist', 401));

    //Check if user changed password after the token was issued
    if(currentUser.changedPasswordAfter(decoded.iat)) return next(new AppError('User recently changed the password! Please log in again', 401));

    req.user = currentUser;
    next();
})


exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            console.log('does not include')
            return next(new AppError('Permission denied', 403));
        }

        next();
    }
}

exports.forgotPassword = catchAsync (async (req, res, next) => {
    const REQUEST_PROTOCOL = req.protocol;
    const REQUEST_HOST = req.get('host');
    // Get User 
    const user = await User.findOne({email: req.body.email});

    if(!user) return next(new AppError('There is not user with this email address', 404));

    //Generate random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({validateBeforeSave: true})

    //Reset Password
    const resetURL = `${REQUEST_PROTOCOL}://${REQUEST_HOST}/api/v1/authUsers/resetPassword/${resetToken}`;

    const message = `Did you forget your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this message.`
    
    try{
        //Send email
        await sendEmail({
            email: user.email, 
            subject: 'Your password reset token (valid for 10 min)',
            message
        })
        res.status(200).json({
            status: 'sucess',
            message: 'Token sent to email'
        })

    } catch(err){
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({validateBeforeSave: true});
        return next(new AppError('There was an error sending the email. Try again later!', 403));
    }
})

exports.resetPassword = (req, res, next) => {}