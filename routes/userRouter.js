const express = require('express');
const userRouter = express.Router();
const storeController = require('../controllers/storeController');

userRouter.get('/', storeController.getUserHome);

userRouter.get('/home-list', storeController.getHomelist);

userRouter.get('/home-list/:homeId', storeController.getHomeDetails);

userRouter.get('/home-details', storeController.getHomeDetails);

userRouter.get('/favorites', storeController.getFavorites);

userRouter.post('/favorites', storeController.postFavorites);

userRouter.get('/reserved', storeController.getReservedHomes);

userRouter.get('/bookings', storeController.getBookings);

exports.userRouter = userRouter;