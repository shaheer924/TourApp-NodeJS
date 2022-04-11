const express = require('express');

//reading data

const Controller = require('../Controller/tourController')
const authController = require('../Controller/authController');

const router = express.Router();

// router.param('id',Controller.CheckID)

//get request

router.route('/cheap-tours').get(Controller.CheapTours, Controller.getAllTours);
router.route('/tour-stats').get(Controller.getTourStats);
router.route('/monthly-plan/:year').get(Controller.getMonthlyPlan);
router
    .route('/')
    .get(authController.protect,Controller.getAllTours)
    .post(authController.protect,Controller.postTour);

//get request with id
router
    .route('/:id')
    .get(authController.protect,Controller.getTour)
    .patch(authController.protect,Controller.updateTour)
    .delete(authController.protect,Controller.deleteTour);

module.exports = router;