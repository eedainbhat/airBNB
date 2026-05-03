//imports
const Home = require('../models/home');
const Favourites = require('../models/favorites');


exports.getHomeAdded = (req, res) => {
    const { name, price, location, photo, description } = req.body;
    const home = new Home({ name, price, location, photo, description });
    home.save().then(() => {
        res.render('host/homeAdded', {
            isLoggedIn: req.isLoggedIn,
        });
    })
}


exports.getHostHome = (req, res) => {
    res.render('host/hostHome',{ 
        currentPage: 'home',
        isLoggedIn: req.isLoggedIn,
    })
};

exports.getAddHome = (req, res) => {
    res.render('host/addHome',{
        currentPage: 'add-home',
        isLoggedIn: req.isLoggedIn,
    })
};

exports.getEditHomes = (req, res) => {
    const homeId = req.params.homeId;
    Home.findById(homeId).then(home => {
        res.render("host/edit-home", { home, currentPage: 'edit-home', isLoggedIn: req.isLoggedIn, })
    }).catch(error => {
        console.log('Error while updating home', error);
    });
};

exports.getHostHomelist = (req, res) => {
    Home.find().then((homelist) => {
        res.render('host/host-homelist', { homelist, currentPage: 'home-list', isLoggedIn: req.isLoggedIn, });
    });
};

exports.postEditHomes = (req, res) => {
    const { name, price, location, photo, description } = req.body;
    const homeId = req.body.homeId;
    Home.findById(homeId).then((home) => {
        home.name = name;
        home.price = price;
        home.location = location;
        home.photo = photo;
        home.description = description;
        return home.save()
            .then((updatedHome) => {
                console.log('Home updated');
                res.redirect("/host/host-homelist")
            }).catch(error => {
                console.log('Error while updating home', error);
            });
    }).catch(error => {
        console.log('Error while updating home', error);
    });
}

exports.postDeleteHome = (req, res) => {
    const homeId = req.params.homeId;
    Home.findByIdAndDelete(homeId).then((home) => {
        res.redirect('/host/host-homelist');
    }).catch(error => {
        console.log('Error while reading homeById', error);
    });
}