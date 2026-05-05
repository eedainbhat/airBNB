//imports
const Home = require('../models/home');
const User = require('../models/user');

exports.getUserHome = (req, res) => {
    res.render('store/userHome', {
        currentPage: 'home',
        isLoggedIn: req.isLoggedIn,
        user: req.session.user
    });
};

exports.getHomelist = async (req, res) => {
    try {
        const homelist = await Home.find();
        const userId = req.session.user.id;
        const user = await User.findById(userId);
        const favHomes = user.favourites.map(favHomeId => favHomeId.toString());
        res.render('store/userHomelist', {
            homelist,
            favHomes,
            currentPage: 'home-list',
            isLoggedIn: req.isLoggedIn,
            user: req.session.user
        });
    } catch (error) {
        console.log('Error while reading DB homelist', error);
    }
};

exports.getHomeDetails = async (req, res) => {
    try {
        const homeId = req.params.homeId;
        const home = await Home.findById(homeId);
        if (!home) {
            res.render("error.ejs");
        } else {
            res.render('store/home-details', {
                home,
                currentPage: 'home-details',
                isLoggedIn: req.isLoggedIn,
                user: req.session.user
            });
        }
    } catch (error) {
        console.log('Error while reading homeById', error);
    }
};


exports.getReservedHomes = (req, res) => {
    res.render('store/reserved', {
        currentPage: 'reserved',
        isLoggedIn: req.isLoggedIn,
        user: req.session.user
    });
};

exports.getBookings = (req, res) => {
    res.render('store/bookings', {
        currentPage: 'bookings',
        isLoggedIn: req.isLoggedIn,
        user: req.session.user
    });
};

exports.getFavorites = async (req, res) => {
    const userId = req.session.user.id;
    const user = await User.findById(userId).populate('favourites');
    const favouriteHomes = user.favourites;

    res.render('store/favorites', {
        favouriteHomes,
        isFavorite: true,
        currentPage: 'favourites',
        isLoggedIn: req.isLoggedIn,
        user: req.session.user
    })
};

exports.postFavorites = async (req, res) => {
    const homeId = req.body.id;
    const userId = req.session.user.id;

    const user = await User.findById(userId);
    const favourites = user.favourites;

    if (!favourites.includes(homeId)) {
        favourites.push(homeId);
    } else {    
        favourites.pull(homeId);
    }

    await user.save();
    res.redirect('/user/favorites');
};



