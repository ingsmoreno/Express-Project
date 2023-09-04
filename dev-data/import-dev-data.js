const mongoose = require('mongoose');
const dotenv = require('dotenv');
const readFile = require('../readfile');
const Tours = require('../models/tourModel');
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

const importData = async () => {

    try {
        await Tours.create(toursData);
        console.log('Data successfully uploaded');
    } catch(err){ 
        console.log(err);
    }

    process.exit();
}


const deleteData = async () => {

    try {
        await Tours.deleteMany();
        console.log('Data successfully deleted');
        
    } catch(err){ 
        console.log(err);
    }

    process.exit();
}

// command node ./dev-data/import-dev-data.js --import
process.argv.includes('--import') ? importData() : deleteData();