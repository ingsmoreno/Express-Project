const path = require('path')
const express = require('express');
const { rateLimit } = require('express-rate-limit');
const dotenv = require('dotenv')
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const authRouter = require('./routes/authRoutes');
const reviewRouter = require('./routes/reviewRoutes')
const viewRouter = require('./routes/viewRoutes')
const AppError = require('./utils/appError');
const globalHandlerError = require('./controllers/errorController')
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp')

const app = express();


//REF: https://expressjs.com/en/guide/using-template-engines.html
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'))

//GLOBAL MIDDLEWARES
//app.use(express.static(`${__dirname}/public`))
app.use(express.static(path.join(__dirname, 'public')))

//Set security HTTP headers
app.use(helmet());

dotenv.config({path: './config.env'});

const rateLimiting = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again after an hour',
})
// Data Sanitization agains NoSQL query injection


app.use('/api', rateLimiting);

console.log(process.env.NODE_ENV)
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}


//Body parser, reading data from body into req.body
app.use(express.json({limit: '10kb'}));

//ALL THESE CONFIGURATIONS SHOULD BE AFTER CALLING BODY PARSER
app.use(mongoSanitize());

//Data Sanitization agains XSS
app.use(xss());

//HTTP Parameter Pollution
app.use(hpp({
    whitelist: 
    ['duration',
    'ratingAverage', 
    'ratingQuantity', 
    'difficulty', 
    'price']
}))



//Test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
   // console.log(x);
    next();
})

//ROUTES

app.use('/', viewRouter)
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth-users', authRouter);
app.use('/api/v1/reviews', reviewRouter);


app.all('*', (req, res, next) => {
    next(new AppError(`This url ${req.originalUrl} does not exist`, 404));
})

app.use(globalHandlerError);

module.exports = app;