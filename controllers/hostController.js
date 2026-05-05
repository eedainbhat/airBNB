//imports
const Home = require('../models/home');


exports.getHomeAdded = (req, res) => {
    const { name, price, location, photo, description } = req.body;
    const home = new Home({ name, price, location, photo, description });
    home.save().then(() => {
        res.render('host/homeAdded', {
            isLoggedIn: req.isLoggedIn,
            user: req.session.user
        });
    })
}


exports.getHostHome = (req, res) => {
    res.render('host/hostHome',{ 
        currentPage: 'home',
        isLoggedIn: req.isLoggedIn,
        user: req.session.user
    })
};

exports.getAddHome = (req, res) => {
    res.render('host/addHome',{
        currentPage: 'add-home',
        isLoggedIn: req.isLoggedIn,
        user: req.session.user
    })
};

exports.getEditHomes = (req, res) => {
    const homeId = req.params.homeId;
    Home.findById(homeId).then(home => {
        res.render("host/edit-home", { home, currentPage: 'edit-home', isLoggedIn: req.isLoggedIn, user: req.session.user })
    }).catch(error => {
        console.log('Error while updating home', error);
    });
};

exports.getHostHomelist = (req, res) => {
    Home.find().then((homelist) => {
        res.render('host/host-homelist', { homelist, currentPage: 'home-list', isLoggedIn: req.isLoggedIn, user: req.session.user });
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