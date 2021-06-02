const express = require('express');

const userRouter =express.Router();

const userController = require('../controllers/user.controller');

userRouter.post('/register',userController.register);

userRouter.post('/login', userController.login);

userRouter.put('/changePassword', userController.changePassword);

module.exports = userRouter;