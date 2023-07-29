const fs = require('fs');
const readFile = require('../readfile');
const Tour = require('./../models/tourModel');

const tours = readFile('tours-simple.json');

// exports.checkId = (req, res, next, val) => {
//     const id = val * 1;
//     const tour = tours.filter(element => element !== null ).find(element => element.id === id);

//     if(!tour) return res.status(404).json({message: '404 NOT FOUND'});
//     if(tour["deletedAt"])  return res.status(404).json({message: '404 NOT FOUND'});
//     next();
// }

// exports.checkBody = (req, res, next) => {

//     if(!req.body['price'] && !req.body['name']) return res.status(404).json({message: 'price and name values are empty'});
//     if(!req.body['price']) return res.status(404).json({message: 'price value is empty'});
//     if(!req.body['name']) return res.status(404).json({message: 'name value is empty'});
//     next();
// }



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

        const queryObj = {...req.query};
        const excludedFielfs = ['page', 'sort', 'limit', 'fields'];

        excludedFielfs.forEach(el => delete queryObj[el])

        //ADVANCED FILTERING
        const queryStr = JSON.stringify(queryObj).replace(/\b(gte|gt|lt|lte)\b/g, match => `$${match}`);

        let query = Tour.find( JSON.parse(queryStr) );
        
        //SORTING
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ')
            query = query.sort(sortBy);
        }

        // Field Limiting

        if(req.query.fields){

            const fields = req.query.fields.split(',').join(' ')
            console.log(fields)
            query = query.select(fields)

        } else {
            query = query.select('-__v')
        }

        // Pagination 
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 100
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit)

        if(req.query.page){
            const countPage = await Tour.countDocuments();
            if(skip >= countPage) throw new Error('This page does not exist')
        }
        
        const tours = await query;

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