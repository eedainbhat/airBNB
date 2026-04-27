//imports
const Home = require('../models/home');
const Favourites = require('../models/favorites');

exports.getUserHome = (req, res) => {
    res.render('store/userHome');
};

exports.getHomelist = (req, res) => {
    Home.fetchAll((homelist) => {
        Favourites.getFavorites((favHomes)=>{
        res.render('store/userHomelist', { homelist, favHomes });
        })
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

exports.postFavorites = (req, res) => {
    Favourites.addFavories(req.body.id, () => {
        res.redirect('/user/favorites');
    });
};

exports.getFavorites = (req, res) => {
    Favourites.getFavorites(favHomes => {
        Home.fetchAll((homelist) => {
            const favouriteHomes = favHomes.map(homeId => homelist.find(home => homeId === home.id));
            res.render('store/favorites', { favouriteHomes, isFavorite: true });
        })
    })
};