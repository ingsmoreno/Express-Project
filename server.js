const mongoose = require('mongoose');
const dotenv = require('dotenv')
const app = require('./app');

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION')
    console.log(err.name, err.message)
    process.exit(1) // unsuccessfull connection
})

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


// const TourDoc = new Tour({
//     name: 'The Park Camper',
//     price: 297,
// })

// TourDoc.save().then(doc => {
//     console.log(doc)
// }).catch(err => console.log(err))

const PORT = process.env.PORT || 3000;
const HOST = 'localhost';

const server = app.listen(PORT, HOST, () => {
    console.log('listening ' + PORT) 
})

//event listener
process.on('unhandledRejection', err => {
    console.log(err.name)
    console.log(err.message)

    server.close(() => {
        process.exit(1) // unsuccessfull connection
    });

})