const mongoose = require('mongoose');
const dotenv = require('dotenv');
const readFile = require('../readfile');
const Tours = require('../models/tourModel');
const Users = require('../models/userModel');
const Reviews = require('../models/reviewModel');

dotenv.config({path: './config.env'});

const DB = process.env.DATABASE.replace(
    '<PASSWORD>', process.env.DATABASE_PASSWORD
    );

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
.then(() => console.log('Succesfully connection to MongoDB'))
.catch(err => {
    if(err) throw Error("Connect error to MongoDB")}
    )

const toursData = JSON.parse(readFile('tours.json'));
const usersData = JSON.parse(readFile('users.json'));
const reviewsData = JSON.parse(readFile('reviews.json'));


const importData = async () => {

    try {
        await Tours.create(toursData);
        await Users.create(usersData, {validateBeforeSave: false});
        await Reviews.create(reviewsData);

        console.log('Data successfully uploaded');
    } catch(err){ 
        console.log('ERROR: ', err);
    }

    process.exit();
}


const deleteData = async () => {

    try {
        await Tours.deleteMany();
        await Users.deleteMany();
        await Reviews.deleteMany();

        console.log('Data successfully deleted');
        
    } catch(err){ 
        console.log('ERROR', err);
    }

    process.exit();
}

// command node ./dev-data/import-dev-data.js --import
process.argv.includes('--import') ? importData() : deleteData();