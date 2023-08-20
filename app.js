const express = require('express');
const dotenv = require('dotenv')
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')



const app = express();

dotenv.config({path: './config.env'});

console.log(process.env.NODE_ENV)
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

app.use(express.json());

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter); 

app.all('*', (req, res, next) => {

    const err = new Error(`This url ${req.originalUrl} does not exist`);
    err.statusCode = 404;
    err.status = 'fail'
    next(err);
})

app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    })
})

module.exports = app;

