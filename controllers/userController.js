const User = require('./../models/userModel');
const catchAsync = require("../utils/catchAsync");
const { deleteOne, updateOne, getOne, getAll } = require('./handlerFactory');
const multer = require('multer');
const AppError = require('../utils/appError');

const multerStorage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './public/img/users')
    },
    filename: function(req, file, cb) {
        const format = file.mimetype.split('/')[1];
        cb(null, `user-${req.user.id}-${Date.now()}.${format}`);
    }
})

const multerFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image')){
        cb(null, true);
    } else {
        cb(new AppError('Please upload only images'))
    }
}

const upload = multer({storage: multerStorage, fileFilter: multerFilter
})


exports.uploadUserPhoto = upload.single('photo');

const filterRoles = (obj, ...allowedFields) => { 
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)) newObj[el] = obj[el];
    })
    return newObj;
}

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
}

exports.updateMe = catchAsync( async (req, res, next) => {
    // 1) Create error if user post password data
    if(req.body.password || req.body.passwordConfirm ) return next(new AppError('The password cannot be updated. Please update password in /updatePassword', 401));

    // 2) Filter put wanted fields that are allowed to be updated
    const filterFields = filterRoles(req.body, 'name', 'email');

    if(req.file) filterFields.photo = req.file.filename;

    const updateUser = await User.findByIdAndUpdate(req.user._id, filterFields, {
        new: true,
        runValidators: true
    })

    // 3) Update user document

    res.status(201).json({
        status: 'success',
        data: updateUser
    })
})

exports.deleteMe = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndUpdate({_id: req.user._id}, {active: false});
    
    res.status(204).json({
        status: 'success',
        data: null
    })

})

exports.getAllUsers = getAll(User);
exports.getOneUser = getOne(User);
exports.updateUser = updateOne(User); // REVIEW AUTHORIZATION, PASSWORD CANNOT BE UPDATED HERE! 
exports.deleteUserById = deleteOne(User);