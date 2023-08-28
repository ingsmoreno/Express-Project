const express = require('express');
const dotenv = require('dotenv')
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalHandlerError = require('./controllers/errorController')



const app = express();

dotenv.config({path: './config.env'});

console.log(process.env.NODE_ENV)
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

app.use(express.json());

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
   // console.log(x);
    next();
})

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter); 

app.all('*', (req, res, next) => {
    next(new AppError(`This url ${req.originalUrl} does not exist`, 404));
})

app.use(globalHandlerError);

module.exports = app;

