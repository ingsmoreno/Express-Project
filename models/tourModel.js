const mongoose = require('mongoose');

const toursSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        tim: true
    }, 
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty']
    },
    price: {
        type: Number, 
        required: [true, 'A tour must have a price']
    },
    priceDiscount: Number,
    summary: {
        type: String, 
        trim: true,
        required: [true, 'A tour must have a description']
    },
    ratingAverage: {
        type: Number, 
        default: 4.5
    },
    ratingQuantity: {
        type: Number, 
        default: 0
    },
    description: {
        type: String, 
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date]
}, 
{
    toJSON: { virtuals: true },
    toObject: {virtuals: true},
}
)


//This cannot be searched into the properties for the schema
//this is only for business logic
toursSchema.virtual('durationWeeks').get(function(){
    return this.duration / 7;
})

const Tour = mongoose.model('Tour', toursSchema);

module.exports = Tour;