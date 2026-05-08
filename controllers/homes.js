//imports
const Home = require('../models/home');

exports.getHome = (req, res) => {
    res.render('home', {
        isLoggedIn: req.isLoggedIn,
        user: req.session.user
    })
};








