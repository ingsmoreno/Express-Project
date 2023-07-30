const fs = require('fs');
const readFile = require('../readfile');
const Tour = require('./../models/tourModel');
const APIFeatures = require('../utils/apiFeatures')

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
                    numTours: {$sum: '1'},
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
            {
                $match: {
                    _id: {$ne: 'EASY'}
                }
            }
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

exports.postTour = async (req, res) => {

        try{
            const newTour = await Tour.create(req.body)
            res.status(201).json({
                status: 'success',
                data: {
                tour: newTour
                }
            })
        }catch(err){
            console.log(err)
            res.status(400).json({
                status: "fail",
                message: err
            })
        }

        
} 

exports.getTourById = async (req, res) => {

    try{
        const tour = await Tour.findById(req.params.id)
        res.status(200).json({
            status: 'success',
            data: {
                tours: tour
            },
        })

    }catch(err){
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }

} 

exports.getAllTours = async (req, res) => {

    try{
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

    } catch(err){
        res.status(400).json({
            status: "fail",
            message: err
        })
    }
} 

exports.patchTour = async (req, res) => {

    try{
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
    
        res.status(200).json({
            status: 'successfully updated',
            data: {
                tour, // when the key and the value are the same, they can only have one name. 
                updatedAt: req.requestTime
            }
        })

    }catch(err){
        console.log(err, 'ERR')
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }

} 

exports.deleteTour = async (req, res) => {

    try{
        const deleteTour = await Tour.findByIdAndDelete(req.params.id);
        if(deleteTour){
            res.status(204).json({
                status: 'success',
                data: {
                    tour: deleteTour,
                }
            })
        }else {
            throw Error('NOT FOUND')
        }

    } catch(err){
        console.log(err, 'ERR')
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
} 