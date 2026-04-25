//imports
const Home = require('../models/home');


exports.getHomeAdded = (req, res) => {
    const { name, price, location, photo } = req.body;
    const home = new Home(name, price, location, photo);
    home.save();
    res.render('host/homeAdded');
}


exports.getHostHome = (req, res) => {
    res.render('host/hostHome')
};

exports.getAddHome = (req, res) => {
    res.render('host/addHome')
};

exports.getEditHomes = (req, res) => {
    res.render('host/edit-home');
};

exports.getHostHomelist = (req, res) => {
    res.render('host/host-homelist');
};