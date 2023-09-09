const mongoose = require('mongoose');

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
    tour: [{
        type: mongoose.Types.ObjectId,
        ref: 'Tour',
        required: [true, 'Review must belong to a Tour']
    }], 
    user: [{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a User']
    }]
}, 
{
    toJSON: { virtuals: true },
    toObject: {virtuals: true},
}

)

//REF: https://mongoosejs.com/docs/5.x/docs/populate.html#:~:text=Mongoose%20has%20a%20more%20powerful,from%20other%20collection(s).
reviewSchema.pre(/find/, function(next){
    this.populate({
        path: 'user',
        select: 'name'
    }).populate({
        path: 'tour', 
        select: 'name' 
    })

    next();
})

const Review = mongoose.model('Reviews', reviewSchema);

module.exports = Review;