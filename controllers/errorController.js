const AppError = require('./../utils/appError');

const handleMesageFormatError = error =>  {
    const message = `Invalid ${error.path}: ${error.value}`

    return new AppError(message, 400);

}

const handleDuplicateError = error => {
    const message = `Duplicate field "${error.keyValue.name}", please use another value`;
    
    return new AppError(message, 400);
}

const sendErrorDev = (err, res) => {
    return res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    })
} 

const sendErrorProd = (err, res) => {

    //operational errors, send message to client
    if(err.isOperational){
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })

    } else {
    //programming errors (mongo or third party libraries error)
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        })
    }
} 


module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if(process.env.NODE_ENV === 'development'){
        sendErrorDev(err, res);
        
    }else if(process.env.NODE_ENV === 'production'){
        let error = { ...err };
        if(error.code === 11000) {
            error = handleDuplicateError(error)
        } else if(error.messageFormat === undefined){
            error = handleMesageFormatError(error)
        };
        sendErrorProd(error, res);
    }

}