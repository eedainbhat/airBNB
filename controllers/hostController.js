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
    const homeId = req.params.homeId;
    Home.findById(homeId, (home) => {
        if (!home) {
            res.render('error');
        } else {
            res.render("host/edit-home", { home })
        }
    })
};

exports.getHostHomelist = (req, res) => {
    Home.fetchAll((homelist) => {
        res.render('host/host-homelist', { homelist });
    });
};

exports.postEditHomes = (req, res) => {
    const homeData = req.body;
    const homeId = req.body.homeId;
    Home.updateHome(homeId, homeData, (home) => {
        res.redirect("/host/host-homelist")
    })
}

exports.postDeleteHome = (req, res) => {
    const homeId = req.params.homeId;
    Home.deleteHome(homeId, (home) => {
        res.redirect('/host/host-homelist');
    })
}