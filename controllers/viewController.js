const Tour = require("../models/tourModel")
const Users = require("../models/userModel")

const catchAsync = require("../utils/catchAsync")

exports.getOVerview = catchAsync(async (req, res, next) => {

    console.log(req.body)
    // 1) Get Tour data from collection
       const tours =  await Tour.find();

    // 2) Build Template

    // 3) Render that template using tour data from 1)
    res.status(200).set(
        'Content-Security-Policy',
        "connect-src 'self' localhost:3000/"
        ).render('overview', {
        title: "All Tours",
        tours
    })
})

exports.getTours = catchAsync( async (req, res, next) => {
    const tour = await Tour.findOne(req.params).populate({
        path: 'reviews',
        select: 'review rating user'
    })
    //const reviews = await Review.find({tour: tour[0].id});
    res.status(200).set(
        'Content-Security-Policy',
        "connect-src 'self' localhost:3000/"
        ).render('tour', {
        title: `${tour.name} Tour`,
        tour: tour
    })
})

exports.getLogin = (req, res) => {

    res.status(200).set(
        'Content-Security-Policy',
        "connect-src 'self' localhost:3000/"
        ).render('login', {
        title: 'Login'
    })
}

