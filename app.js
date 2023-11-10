const path = require('path')
const express = require('express');
const { rateLimit } = require('express-rate-limit');
const dotenv = require('dotenv')
const compression = require('compression')
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const authRouter = require('./routes/authRoutes');
const reviewRouter = require('./routes/reviewRoutes')
const viewRouter = require('./routes/viewRoutes')
const bookingRoutes = require('./routes/bookingRoutes')
const AppError = require('./utils/appError');
const globalHandlerError = require('./controllers/errorController')
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
//REF: https://www.npmjs.com/package/cookie-parser npm i cookie-parser
const cookieParser = require('cookie-parser');

const app = express();

app.enable('trust proxy');


//REF: https://expressjs.com/en/guide/using-template-engines.html
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'))

//GLOBAL MIDDLEWARES
//app.use(express.static(`${__dirname}/public`))
app.use(cors());
app.options('*', cors());
app.use(express.static(path.join(__dirname, 'public')))

//Set security HTTP headers
app.use(helmet({ contentSecurityPolicy: false }));
// app.use(
//     helmet({
//       contentSecurityPolicy: {
//         directives: {
//           defaultSrc: ["'self'", 'data:', 'blob:', 'https:', 'ws:'],
//           baseUri: ["'self'"],
//           fontSrc: ["'self'", 'https:', 'data:'],
//           scriptSrc: [
//             "'self'",
//             'https:',
//             'http:',
//             'blob:',
//             'https://js.stripe.com',
//           ],
//           objectSrc: ["'none'"],
//           styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
//           workerSrc: [
//             "'self'",
//             'data:',
//             'blob:',
//             'https://*.stripe.com',
//           ],
//           childSrc: ["'self'", 'blob:', 'https://*.stripe.com'],
//           imgSrc: ["'self'", 'data:', 'blob:'],
//           formAction: ["'self'"],
//           connectSrc: [
//             "'self'",
//             "'unsafe-inline'",
//             'data:',
//             'blob:',
//             'ws://127.0.0.1:*/',
//             'https://*.stripe.com',
//           ],
//           upgradeInsecureRequests: [],
//         },
//       },
//     })
//   );

dotenv.config({path: './config.env'});

const rateLimiting = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again after an hour',
})
// Data Sanitization agains NoSQL query injection


app.use('/api', rateLimiting);

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}


//Body parser, reading data from body into req.body
app.use(express.json({limit: '10kb'}));
app.use(express.urlencoded({ extended: true, limit: '10kb' })); // REF: https://heynode.com/tutorial/process-user-login-form-expressjs/
app.use(cookieParser())

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


app.use(compression());


//Test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})

//ROUTES

app.use('/', viewRouter);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth-users', authRouter);
app.use('/api/v1/reviews', reviewRouter);


app.all('*', (req, res, next) => {
    next(new AppError(`This url ${req.originalUrl} does not exist`, 404));
})

app.use(globalHandlerError);

module.exports = app;