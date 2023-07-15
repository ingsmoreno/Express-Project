const fs = require('fs');
const readFile = require('../readFile');


const tours = readFile('tours-simple.json');

exports.checkId = (req, res, next, val) => {
    const id = val * 1;
    const tour = tours.filter(element => element !== null ).find(element => element.id === id);

    if(!tour) return res.status(404).json({message: '404 NOT FOUND'});
    if(tour["deletedAt"])  return res.status(404).json({message: '404 NOT FOUND'});
    next();
}

exports.checkBody = (req, res, next) => {

    if(!req.body['price'] && !req.body['name']) return res.status(404).json({message: 'price and name values are empty'});
    if(!req.body['price']) return res.status(404).json({message: 'price value is empty'});
    if(!req.body['name']) return res.status(404).json({message: 'name value is empty'});
    next();
}



exports.postTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({id: newId}, req.body);
    tours.push(newTour);

    fs.writeFile(`${__dirname}/dev-data/tours-simple.json`, 
    JSON.stringify(tours), 
    err => {
        res.status(201).json({
            status: 'success',
            data: {
               tour: newTour
            }
        })
    })
} 



exports.getTourById = (req, res) => {

    res.status(200).json({
        status: 'success',
        data: {
            tours: tours
        },
    })
} 

exports.getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            tours: tours
        },
        results: tours.length,
    })
} 

exports.patchTour = (req, res) => {
    const id = req.params.id * 1;

    const updateTour = tours.filter(element => element !== null ).find(element => element.id === id);

    for (const element in req.body) {
        if (Object.hasOwnProperty.call(updateTour, element)) {
            updateTour[element] = req.body[element];
        }
    }
    fs.writeFile(`${__dirname}/../dev-data/tours-simple.json`, 
    JSON.stringify(tours), 
    err => {
        res.status(200).json({
            status: 'successfully updated',
            data: {
                tour: updateTour
            }
        })
    })
} 

exports.deleteTour = (req, res) => {

    try{
        const deleteId = req.params.id * 1;
        const deleteTour = tours.filter(element => element !== null ).find(element => element.id === deleteId);
        deleteTour['deletedAt'] = req.requestTime;

        fs.writeFile(`${__dirname}/../dev-data/tours-simple.json`, 
        JSON.stringify(tours), 
        err => {
            res.status(204).json({
                status: 'success',
                data: {
                    tour: deleteTour
                }
            })
        })

    } catch(err){
        return res.status(404).json({message: '404 NOT FOUND'})
    }
} 