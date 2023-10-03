const Tour = require("../models/tourModel")
const Review = require("../models/reviewModel")

const catchAsync = require("../utils/catchAsync")

exports.getOVerview = catchAsync(async (req, res) => {

    console.log(req.body)
    // 1) Get Tour data from collection
       const tours =  await Tour.find();

    // 2) Build Template

    // 3) Render that template using tour data from 1)
    res.status(200).render('overview', {
        title: "All Tours",
        tours
    })
})

exports.getTours = catchAsync( async (req, res) => {
    const tour = await Tour.find(req.params).populate({
        path: 'reviews',
        select: 'review rating user'
    })
    //const reviews = await Review.find({tour: tour[0].id});
    res.status(200).render('tour', {
        title: 'Tour',
        tour: tour[0]
    })
})

exports.getLogin = (req, res) => {

    res.status(200).render('login', {
        title: 'Login'
    })
}

