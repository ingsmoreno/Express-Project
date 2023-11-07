const crypto = require('crypto')
const { promisify } = require('util');
const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const Email = require('../utils/email');


const signToken = (userId) => {
    return jwt.sign({id: userId}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}


const createSendToken = ( user, res, statusCode, status, req, response) => {
    const token = signToken(user._id);
    
    res.cookie('jwt', token, {
        expires: new Date(Date.now() + process.env.JWT_COOKIES_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: req.secure || req.headers('x-forwarded-proto') === 'https' 
    } );
    user.password = undefined

    if(response){
        res.status(201).json({
            status: 'success',
            token,
            data: response
            
        })
    } else {
        res.status(statusCode).json({
            status,
            token,
        })

    }

}

exports.logOut = (req, res) => {

    res.cookie('jwt', 'logged out', {
        expires: new Date(Date.now() + 10 * 1000 ),
        httpOnly: true
    } )

    res.status(200).json({
        status: 'success'
    })
}

exports.singup = catchAsync(async (req, res) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt,
        role: req.body.role,
    }); 

    const url = `${req.protocol}://${req.get('host')}/login`
    await new Email(newUser, url).sendWelcome();

  createSendToken(newUser, res, 201, 'success', req, {user: newUser});

})


exports.login =  catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if(!email || !password) return next(new AppError('Please provide an email and password', 400));
                                            // select: false in userModels
    const user = await User.findOne({email}).select('+password');
    const correct = await user.correctPassword(password, user.password);

    if(!user || !correct) return next(new AppError('Incorrect password or email', 401));

    createSendToken(user, res, 201, 'success', req);

});

exports.protect = catchAsync (async (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }else if(req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if(!token) return next(new AppError('You are not logged in! Please log in to get access', 401));

    // Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
   
    // Check if user still exist
    const currentUser = await User.findById(decoded.id);
    if(!currentUser) return next(new AppError('This token does not longer exist', 401));

    //Check if user changed password after the token was issued
    if(currentUser.changedPasswordAfter(decoded.iat)) return next(new AppError('User recently changed the password! Please log in again', 401));

    req.user = currentUser;
    res.locals.user = currentUser;
    next();
})

exports.loggedIn = async (req, res, next) => {

    if(req.cookies.jwt) {
        try{
            // 1) Verification token
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
            // 2) check if user still exists
            const currentUser = await User.findById(decoded.id);
            if(!currentUser) return next();
            // 3) check if user changed password after the token was issued
            if(currentUser.changedPasswordAfter(decoded.iat)) return next();
            res.locals.user = currentUser;
            return next();

        }catch(error){
            return next();
        }
    }
    next()
}


exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
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

    try{
        //Reset Password
        const resetURL = `${REQUEST_PROTOCOL}://${REQUEST_HOST}/api/v1/authUsers/resetPassword/${resetToken}`;
        await new Email(user, resetURL).sendResetPassword();
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

exports.resetPassword = catchAsync(async (req, res, next) => {
    //Get user based on Token
    const hashToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex')

    const user = await User.findOne({passwordResetToken: hashToken, passwordResetExpires: {$gt: Date.now()}});
    
    //if token has not expired and there is user set the new password
    if(!user) return next(new AppError('The token has been changed or expired', 400));

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;
    await user.save();

    //Log the user in and send JWT
    createSendToken(user, res, 201, 'success', req);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
    // 1) Get user  from collectio
    if(!req.body.oldPassword) return next(new AppError('Please provide the oldPassword', 400));
    const user = await User.findOne(req.user._id).select('+password');

    // 2) Check if post current password is correct
    if(!(await user.correctPassword(req.body.oldPassword, user.password))) return next(new AppError('The old password is not correct', 401));

    // 3) Update password
    user.password = req.body.newPassword
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    // 4) Log user in, send JWT
    createSendToken(user, res, 201, 'success', req, {message: "Password changed successfully"} );
})