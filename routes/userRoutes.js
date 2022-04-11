const express = require('express');


const Controller = require('../Controller/userController')
const authController = require('../Controller/authController')

const router = express.Router();

router.route('/signup').post(authController.signup);
router.post('/login', authController.login);

//get request
router
    .route('/')
    .get(Controller.getAllUsers)
    .post(Controller.postUser);

//get request with id
router
    .route('/:id')
    .get(Controller.getUser)
    .patch(Controller.updateUser)
    .delete(Controller.deleteUser);


module.exports = router;