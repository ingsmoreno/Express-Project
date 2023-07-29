const mongoose = require('mongoose');
const dotenv = require('dotenv');
const readFile = require('../readfile');
const Tours = require('../models/tourModel');

const toursData = JSON.parse(readFile('tours-simple.json'));

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

process.argv.includes('--import') ? importData() : deleteData();