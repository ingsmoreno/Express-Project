const fs = require('fs');
const readFile = require('../readfile');
const Tour = require('./../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const { deleteOne, updateOne, createOne, getOne, getAll } = require('./handlerFactory');

const tours = readFile('tours-simple.json');

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingAverage,summary,difficulty';
    next();
}
//https://www.mongodb.com/docs/manual/reference/operator/aggregation-pipeline/
exports.getTourStats = async (req,res) => {
    try{
        const stats = await Tour.aggregate([
            {
                $match: { 
                    ratingAverage: {$gte: 4.5}
                }
            },
            {
                $group: {
                    _id: {$toUpper: '$difficulty'},
                    numTours: {$sum: 1},
                    numRatings: {$sum: '$ratingQuantity'},
                    avgRating: {$avg: '$ratingAverage'},
                    avgPrice: {$avg: '$price'},
                    minPrice: {$min: '$price'},
                    maxPrice: {$max: '$price'},
                }
            },
            {
                $sort: {
                    avgPrice: 1
                }
            },
            // {
            //     $match: {
            //         _id: {$ne: 'EASY'}
            //     }
            // }
        ])

        res.status(200).json({
            status: 'success',
            data: {
                stats
            },
        })

    }catch(err){
        console.log(err)
        res.status(400).json({
            status: "fail",
            message: err
        })

    }
}

exports.getMonthlyPlan = async ( req, res) => {

    try{
        const year = req.params.year * 1;
        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`),
                }
                }
            },
            {
                $group: {
                    _id: {$month: '$startDates'},
                    numTourStarts: {$sum: 1},
                    name: {$push: '$name'}
                }
            },
            {
                $addFields: {
                 month: '$_id'
                }
            },
            {
                $project: {
                    _id: 0
                }
            }, 
            {
                $sort: {numTourStarts: -1}
            },
            {
                $limit: 6
            }

        ])
        res.status(201).json({
            status: "success",
            results: plan.length,
            plan  
        })
    }catch(err){
        console.log(err)
        res.status(400).json({
            status: "fail",
            message: err
        })
    }

}


// geo-within/:distance/center/:latlng/unit/:unit
exports.geospatialWithin = catchAsync ( async (req, res, next) => {

    const { distance, latlng, unit } = req.params;
    const [lat, lng ] = latlng.split(',');

    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1

    if(!lat || !lng) return next(new AppError(`Please provide latitude and longitude in the format lat,lng`, 404));

    const doc = await Tour.find({ startLocation: { $geoWithin: { $centerSphere: [ [ lng, lat ], radius ] } }});

    res.status(200).json({
        status: 'success',
        results: doc.length,
        data: doc,
    })
})

exports.getAllTours = getAll(Tour);
exports.getOneTour = getOne(Tour, {path: 'reviews'});
exports.createTour = createOne(Tour);
exports.updateTour = updateOne(Tour);
exports.deleteTour = deleteOne(Tour);