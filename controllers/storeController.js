//imports
const Home = require('../models/home');
const Favourites = require('../models/favorites');

const { ObjectId } = require("mongodb");

exports.getUserHome = (req, res) => {
    res.render('store/userHome');
};

exports.getHomelist = (req, res) => {
    Home.find().then((homelist) => {
        Favourites.find().then((favHomes) => {
            res.render('store/userHomelist', { homelist, favHomes });
        })
    }).catch(error => {
        console.log('Error while reading DB homelist', error);
    })
};

exports.getHomeDetails = (req, res) => {
    const homeId = req.params.homeId;
    Home.findById(homeId).then(home => {
        if (!home) {
            res.render("error.ejs");
        } else {
            res.render('store/home-details', { home });
        }
    }).catch(error => {
        console.log('Error while reading homeById', error);
    });
};


exports.getReservedHomes = (req, res) => { 
    res.render('store/reserved');
};

exports.getBookings = (req, res) => {
    res.render('store/bookings');
};

exports.postFavorites = (req, res) => {
    const homeId = req.body.id;
    Favourites.findOne({homeId}).then((isFavourite) => {
        if (!isFavourite) {
            const fav = new Favourites({homeId});
            fav.save().then((favHomes) => {
                console.log("Favourite added", favHomes);
                res.redirect('/user/favorites');
            })

        } else if (isFavourite) {
            Favourites.findOneAndDelete({homeId}).then(home => {
                console.log('Home removed from favourites');
                res.redirect('/user/favorites');
            })
        };
    }).catch(error => {
        console.log('Error while adding to favourite', error);
        res.redirect('/user/favorites');
    })
};

exports.getFavorites = (req, res) => {
    Favourites.find()
    .populate('homeId')
    .then((favHomes) => {
            const favouriteHomes = favHomes.map(favHome => favHome.homeId).filter(home => home !== undefined);

            res.render('store/favorites', { favouriteHomes, isFavorite: true });
        }).catch(error => {
            console.log('Error while reading DB homelist', error);
        })
};

