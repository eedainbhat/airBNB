const express = require('express');
const userRouter = express.Router();
const storeController = require('../controllers/storeController');
const upload = require('../utils/fileUpload');

userRouter.get('/', storeController.getUserHome);

userRouter.get('/home-list', storeController.getHomelist);

userRouter.get('/home-list/:homeId', storeController.getHomeDetails);

userRouter.get('/home-details', storeController.getHomeDetails);

userRouter.get('/favorites', storeController.getFavorites);

userRouter.post('/favorites', storeController.postFavorites);

userRouter.get('/reserved', storeController.getReservedHomes);

userRouter.get('/bookings', storeController.getBookings);

userRouter.get('/host-profile/:id', storeController.getHostProfile);

userRouter.get('/settings', storeController.getSettings);

userRouter.post('/settings', upload.single('profilePicture'), storeController.postSettings);

userRouter.post('/rules/:homeId', storeController.postDownloadRules);

exports.userRouter = userRouter;