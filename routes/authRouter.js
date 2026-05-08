const express = require('express');
const authRouter = express.Router()
const authController = require('../controllers/authController');

authRouter.get('/welcome', authController.getWelcome);

authRouter.get('/login', authController.getLogin);

authRouter.post('/login', authController.postLogin);

authRouter.get('/logout', authController.getLogout);

authRouter.post('/logout', authController.postLogout);

authRouter.get('/signup', authController.getSignup);

authRouter.post('/signup', authController.postSignup);

authRouter.get('/change-password', authController.getChangePassword);

authRouter.post('/change-password', authController.postChangePassword);

authRouter.post('/delete-account', authController.postDeleteAccount);

exports.authRouter = authRouter;
 