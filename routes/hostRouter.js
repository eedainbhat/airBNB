const express = require('express');
const hostRouter = express.Router();
const hostController = require('../controllers/hostController');


hostRouter.get('/', hostController.getHostHome);

hostRouter.get('/add-home', hostController.getAddHome);

hostRouter.post('/home-added', hostController.getHomeAdded);

hostRouter.get('/host-homelist', hostController.getHostHomelist);

hostRouter.get('/edit-homes', hostController.getEditHomes)

exports.hostRouter = hostRouter;