const express = require('express');
const authRouter = express.Router()
const authController = require('../controllers/authController');

authRouter.get('/login', authController.getLogin);

authRouter.post('/login', authController.postLogin);

authRouter.get('/logout', authController.getLogout);

authRouter.post('/logout', authController.postLogout);

authRouter.get('/signup', authController.getSignup);

authRouter.post('/signup', authController.postSignup);

exports.authRouter = authRouter;
 