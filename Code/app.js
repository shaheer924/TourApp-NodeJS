const express = require('express');

const tourRouter = require('../routes/tourRoutes');
const userRouter = require('../routes/userRoutes');

const app = express();

app.use(express.json());


app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users',userRouter)


app.all('*',(req, res, next) =>{

    const err = new Error(`Cann't find ${req.originalUrl} on this server`);
    err.status = 'Fail';
    err.statusCode = 404;

    next(err); 
})

app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'Error';
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    })
})

module.exports = app;