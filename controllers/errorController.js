const AppError = require('./../utils/appError');

const handleMesageFormatError = error =>  {
    const message = `Invalid ${error.path}: ${error.value}`

    return new AppError(message, 400);

}

const handleDuplicateError = error => {
    const message = `Duplicate field "${JSON.stringify(error.keyValue)}", please use another value`;
    
    return new AppError(message, 400);
}

const handleValidationError = error => {
   const errors = Object.values(error.errors).map(value => value.properties.message)
    const message = `Invalid input data ${errors.join('. ')}`;

    return new AppError(message, 400);
}

const handleJsonWebTokenErrors = () => new AppError('Invalid token. Please log in again', 401);
const handleTokenExpiredError = () => new AppError('Token expired. Please log in again', 401);

const sendErrorDev = (err, req, res) => {

    if(req.originalUrl.startsWith('/api')){
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        })
    }

    return res.status(err.statusCode).render('error', {
        title: 'Page not found',
        msg: err.message
    })

} 

const sendErrorProd = (err, req, res) => {

    if(req.originalUrl.startsWith('/api')){
        //operational errors, send message to client
        if(err.isOperational){
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            })
    
        }

        //programming errors (mongo or third party libraries error)
        return res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        })
    } 

    //Operational trusted error, send message to client
    if(err.isOperational){
        return res.status(err.statusCode).render('error', {
            title: 'Page not found',
            msg: err.message
        })

    }

    //SEND GENERIC MESSAGE
    return res.status(err.statusCode).render('error', {
        title: 'Page not found',
        msg: 'Please try again later.'
    })

} 


module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if(process.env.NODE_ENV === 'development'){
        sendErrorDev(err, req, res);
        
    }else if(process.env.NODE_ENV === 'production'){
        let error = { ...err };
        error.message = err.message
        if(error.code === 11000) {
            error = handleDuplicateError(error)
        } else if(error.hasOwnProperty('messageFormat') && error.messageFormat === undefined){
            error = handleMesageFormatError(error)
        } else if(error._message === 'Validation failed') {
           error = handleValidationError(error);
        } else if(error.name === 'JsonWebTokenError') {
            error = handleJsonWebTokenErrors();
        } else if(error.name === "TokenExpiredError") {
            error = handleTokenExpiredError();
        }
        sendErrorProd(error, req, res);
    }

}