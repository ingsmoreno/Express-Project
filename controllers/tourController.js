const fs = require('fs');
const readFile = require('../readfile');
const Tour = require('./../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

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

exports.postTour = catchAsync(async (req, res, next) => {

        const tour = await Tour.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
            tour
            }
        })
});

exports.getTourById = catchAsync (async (req, res, next) => {

        const tour = await Tour.findById(req.params.id);

        if(!tour) return next(new AppError(`The id ${req.params.id} tour does not exist`, 404));

        res.status(200).json({
            status: 'success',
            data: {
                tours: tour
            },
        })

});

exports.getAllTours = catchAsync(async (req, res, next) => {
        const feature = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limit()
            .paginate()
    
        const tours = await feature.queryMongo;

        res.status(200).json({
            status: 'success',
            data: {
                tours: tours
            },
            results: tours.length,
        })
})

exports.patchTour = catchAsync(async (req, res, next) => {

        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if(!tour) return next(new AppError(`The id ${req.params.id} tour does not exist`, 404));
    
        res.status(200).json({
            status: 'successfully updated',
            data: {
                tour, // when the key and the value are the same, they can only have one name. 
                updatedAt: req.requestTime
            }
        })

})

exports.deleteTour = catchAsync(async (req, res, next) => {
        const tour = await Tour.findByIdAndDelete(req.params.id);
        
        if(!tour) return next(new AppError(`The id ${req.params.id} tour does not exist`, 404));
        res.status(204).json({
            status: 'success',
            data: {
                tour
            }
        })

});