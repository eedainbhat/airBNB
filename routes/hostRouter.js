const express = require('express');
const hostRouter = express.Router();
const hostController = require('../controllers/hostController');
const upload = require('../utils/fileUpload');


hostRouter.get('/', hostController.getHostHome);

hostRouter.get('/add-home', hostController.getAddHome);

hostRouter.post('/home-added', upload.single('photo'), hostController.postHomeAdded);

hostRouter.get('/host-homelist', hostController.getHostHomelist);

hostRouter.get('/edit-homes/:homeId', hostController.getEditHomes);

hostRouter.get('/profile-dashboard', hostController.getProfileDashboard);

hostRouter.get('/edit-profile', hostController.getEditProfile);

hostRouter.post('/edit-profile', upload.single('profilePicture'), hostController.postEditProfile);

hostRouter.post('/edit-home', upload.single('photo'), hostController.postEditHomes);

hostRouter.post('/delete-home/:homeId', hostController.postDeleteHome);


hostRouter.get('/add-rules/:homeId', hostController.getAddRules);

hostRouter.post('/add-rules/:homeId', hostController.postAddRules);

exports.hostRouter = hostRouter;