//imports
const Home = require('../models/home');

exports.getUserHome = (req, res) => {
    res.render('store/userHome');
};

exports.getHomelist = (req, res) => {
    Home.fetchAll((homelist) => {
        res.render('store/userHomelist', { homelist });
    });
};

exports.getHomeDetails = (req, res) => {
    const homeId = req.params.homeId;
    Home.findById(homeId, (home) => {
        if (!home) {
            res.render("error.ejs");
        } else {
            res.render('store/home-details', { home });
        }
    })
};


exports.getReservedHomes = (req, res) => {
    res.render('store/reserved');
};

exports.getBookings = (req, res) => {
    res.render('store/bookings');
};

exports.getFavorites = (req, res) => {
    res.render('store/favorites');
};