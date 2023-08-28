const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator'); //https://github.com/validatorjs/validator.js

// BUILT IN VALIDATORS https://mongoosejs.com/docs/validation.html#built-in-validators
const toursSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true, 
        maxlength: [40, "A tour name must have less or equal than 40 characters"],
        minlength: [10, "A tour name must have more or equal than 10 characters"],
       // validate: [validator.isAlpha, "The tour name must only have characters"]

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
        required: [true, 'A tour must have a difficulty'],
        enum: {
            values:['easy', 'medium', 'difficult'],
            message: "Difficulty either: easy, medium or difficult"
        }
    },
    price: {
        type: Number, 
        required: [true, 'A tour must have a price'],
    },
    slug: String,
    priceDiscount: {
        type: Number, 
        validate: {
            validator: function(value){
                return value < this.price;
            }, 
            message: "The discount price {{VALUE}} must be below of the price",
        }
    },
    summary: {
        type: String, 
        trim: true,
        required: [true, 'A tour must have a summary']
    },
    ratingAverage: {
        type: Number, 
        default: 4.5,
        min: [1, "Rating must be above 1.0"],
        max: [5, "Rating must be below 5.0"],

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

toursSchema.pre('aggregate', function(next){
    this.pipeline().unshift({$match: {secretTour: { $ne: true}}});
    next();
})

// toursSchema.post('save', function(doc, next){
//     console.log(doc);
//     next();
// })

const Tour = mongoose.model('Tour', toursSchema);

module.exports = Tour;