const express = require('express');
const hostRouter = express.Router();
const hostController = require('../controllers/hostController');


hostRouter.get('/', hostController.getHostHome);

hostRouter.get('/add-home', hostController.getAddHome);

hostRouter.post('/home-added', hostController.getHomeAdded);

hostRouter.get('/host-homelist', hostController.getHostHomelist);

hostRouter.get('/edit-homes/:homeId', hostController.getEditHomes)

hostRouter.post('/edit-home/', hostController.postEditHomes)

hostRouter.post('/delete-home/:homeId', hostController.postDeleteHome)

exports.hostRouter = hostRouter;