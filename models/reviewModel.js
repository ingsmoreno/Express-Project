const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Review can not be empty']
    }, 
    rating: {
        type: Number,
        min: [1, 'The rating must be above of 1'],
        max: [5, 'The rating must be below of 5']
    }, 
    createdAt: {
        type: Date,
        default: Date.now
    }, 
    tour: {
        type: mongoose.Types.ObjectId,
        ref: 'Tour',
        required: [true, 'Review must belong to a Tour']
    }, 
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a User']
    }
}, 
{
    toJSON: { virtuals: true },
    toObject: {virtuals: true},
}

)

//REF STATICS: https://mongoosejs.com/docs/guide.html#statics
reviewSchema.statics.calcReviewAverage = async function(tourId){
    //'this' points to the current model
    // REF aggregation: https://www.mongodb.com/docs/manual/reference/operator/aggregation/match/
    const stats = await this.aggregate([
        {
            //pipeline stages
            $match: {tour: tourId}
        }, 
        {
            //$group pipeline stages
            //$sum pipeline operator
            $group: { 
                _id: '$tour',
                nRating: { $sum: 1 }, //$sum explain: it sums all the documents that matches with the id 
                avgRating: {$avg: '$rating'}
            }
        }
    ]);

    await Tour.findByIdAndUpdate(tourId, {
        ratingQuantity: stats[0].nRating,
        ratingAverage: stats[0].avgRating

    });
}

//REF POST MIDDLEWARE: https://mongoosejs.com/docs/middleware.html#post
reviewSchema.post('save', function(){
    //'this' points to the new document
    this.constructor.calcReviewAverage(this.tour)
})

reviewSchema.pre(/^findOneAnd/, async function(next){
    //'this' points to the current model
    this.r = await this.findOne();
    next();
})

reviewSchema.post(/^findOneAnd/, async function(){
    await this.r.constructor.calcReviewAverage(this.r.tour)
})




//REF: https://mongoosejs.com/docs/5.x/docs/populate.html#:~:text=Mongoose%20has%20a%20more%20powerful,from%20other%20collection(s).
reviewSchema.pre(/^find/, function(next){
    this.populate({
        path: 'user',
        select: 'name'
    })
    next();
})

const Review = mongoose.model('Reviews', reviewSchema);

module.exports = Review;