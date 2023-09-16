const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');


exports.getAll = Model => catchAsync(async (req, res, next) => {
    //Hack
    let filter = {};
    if(req.params.tourId) filter = {tour: req.params.tourId}

    const feature = new APIFeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .limit()
        .paginate()

    const doc = await feature.queryMongo;

    res.status(200).json({
        status: 'success',
        results: doc.length,
        data: doc,
    })
})

exports.getOne = (Model, populateOptions) => catchAsync (async (req, res, next) => {

    let query = Model.findById(req.params.id)
    if(populateOptions) query = query.populate('reviews');

    const doc = await query

    if(!doc) return next(new AppError(`The id ${req.params.id} document does not exist`, 404));

    res.status(200).json({
        status: 'success',
        data: doc
    });

});

exports.createOne = Model => catchAsync(async (req, res, next) => {

    const doc = await Model.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            doc
        }
    })
});

exports.updateOne = Model => catchAsync(async (req, res, next) => {
    if(req.body.password) return next(new AppError('The password cannot be updated. Please update password in /updatePassword', 401));

    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if(!doc) return next(new AppError(`The id ${req.params.id} document does not exist`, 404));

    res.status(200).json({
        status: 'successfully updated',
        data: {
            doc, // when the key and the value are the same, they can only have one name. 
            updatedAt: req.requestTime
        }
    })
})

exports.deleteOne = Model =>  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    
    if(!doc) return next(new AppError(`The id ${req.params.id} of this document does not exist`, 404));
    res.status(204).json({
        status: 'success',
        data: {
            doc
        }
    })

});