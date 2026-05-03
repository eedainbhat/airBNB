//imports
const Home = require('../models/home');

exports.getWelcome = (req, res) => {
    res.render('welcome', {
        isLoggedIn: false,
    })
};

exports.getHome = (req, res) => {
    res.render('home', {
        isLoggedIn: req.isLoggedIn,
    })
};








