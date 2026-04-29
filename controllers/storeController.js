//imports
const Home = require('../models/home');
const Favourites = require('../models/favorites');

exports.getUserHome = (req, res) => {
    res.render('store/userHome');
};

exports.getHomelist = (req, res) => {
    Home.fetchAll().then((homelist) => {
        Favourites.getFavorites().then((favHomes) => {
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
    Favourites.findFavourite(homeId).then((isFavourite) => {
        if (!isFavourite) {
            const fav = new Favourites(homeId);
            fav.save().then((favHomes) => {
                console.log("Favourite added", favHomes);
                res.redirect('/user/favorites');
            })

        } else if (isFavourite) {
            Favourites.deleteFavourite(homeId).then(home => {
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
    Favourites.getFavorites().then((favHomes) => {
        Home.fetchAll().then((homelist) => {
            const favouriteHomes = favHomes.map(favHome => homelist.find(home => favHome.homeId === home._id.toString())).filter(home => home !== undefined);

            res.render('store/favorites', { favouriteHomes, isFavorite: true });
        }).catch(error => {
            console.log('Error while reading DB homelist', error);
        })
    })
};

