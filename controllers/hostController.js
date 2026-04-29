//imports
const Home = require('../models/home');
const Favourites = require('../models/favorites');


exports.getHomeAdded = (req, res) => {
    const { name, price, location, photo, description } = req.body;
    const home = new Home(name, price, location, photo, description);
    home.save().then(() => {
        res.render('host/homeAdded');
    })
}


exports.getHostHome = (req, res) => {
    res.render('host/hostHome')
};

exports.getAddHome = (req, res) => {
    res.render('host/addHome')
};

exports.getEditHomes = (req, res) => {
    const homeId = req.params.homeId;
    Home.findById(homeId).then(home => {
        res.render("host/edit-home", { home })
    }).catch(error => {
        console.log('Error while updating home', error);
    });
};

exports.getHostHomelist = (req, res) => {
    Home.fetchAll().then((homelist) => {
        res.render('host/host-homelist', { homelist });
    });
};

exports.postEditHomes = (req, res) => {
    const homeData = req.body;
    const homeId = req.body.homeId;

    Home.updateHome(homeId, homeData).then((home) => {
        res.redirect("/host/host-homelist")
    });
}

exports.postDeleteHome = (req, res) => {
    const homeId = req.params.homeId;
    Home.deleteHome(homeId).then((home) => {
        Favourites.deleteFavourite(homeId).then((favHomes) => {
            res.redirect('/host/host-homelist');
        })
    }).catch(error => {
        console.log('Error while reading homeById', error);
    });
}