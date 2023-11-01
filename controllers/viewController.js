const Booking = require("../models/bookingModel")
const Tour = require("../models/tourModel")
const Users = require("../models/userModel")
const AppError = require("../utils/appError")

const catchAsync = require("../utils/catchAsync")

exports.getOVerview = catchAsync(async (req, res, next) => {
    // 1) Get Tour data from collection
       const tours =  await Tour.find();

    // 2) Build Template

    // 3) Render that template using tour data from 1)
    res.status(200).render('overview', {
        title: "All Tours",
        tours
    })
})

exports.getTours = catchAsync( async (req, res, next) => {
    const tour = await Tour.findOne(req.params).populate({
        path: 'reviews',
        select: 'review rating user'
    })

    if(!tour) return next( new AppError('There is not a tour with that name', 404));

    //const reviews = await Review.find({tour: tour[0].id});
    res.status(200).render('tour', {
        title: `${tour.name} Tour`,
        tour: tour
    })
})

exports.getLogin = (req, res) => {

    res.status(200).render('login', {
        title: 'Login'
    })
}

exports.getMe = (req, res) => {

    res.status(200).render('account', {
        title: 'Account'
    })
}

exports.updatingUserData = catchAsync(async (req, res, next) => {

    const updatedUser = await Users.findByIdAndUpdate(req.user.id, {
        name: req.body.user,
        email: req.body.email
    },{
        new: true,
        runValidators: true
    }
    
    );

    res.status(200).render('account', {
        title: 'Account',
        user: updatedUser
    })
})

exports.myTours = catchAsync(async (req, res, next) => {

    const bookings = await Booking.find({user: req.user.id});

    const toursId = bookings.map(book => book.tour.id);
    
    const tours = await Tour.find({_id: { $in : toursId }});

    res.status(200).render('overview', {
        title: 'My Tours',
        tours
    })
})
