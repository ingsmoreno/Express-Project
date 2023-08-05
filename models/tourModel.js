const mongoose = require('mongoose');
const slugify = require('slugify');


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
    slug: String,
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
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false,
    },
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
}); 



//DOCUMENT MIDDLEWARE
//middleware hook / .save, .create // POST
toursSchema.pre('save', function(next){
    this.slug = slugify(this.name, {lower: true});
    next();
});

toursSchema.pre(/^find/, function(next){
    this.find({secretTour: {$ne: true}})

    this.start = Date.now();
    next();
})

toursSchema.post(/^find/, function(doc, next){
    console.log(`Query took ${Date.now() - this.start} milliseconds`)
    console.log(doc);
    next();
})

// toursSchema.post('save', function(doc, next){
//     console.log(doc);
//     next();
// })

const Tour = mongoose.model('Tour', toursSchema);

module.exports = Tour;