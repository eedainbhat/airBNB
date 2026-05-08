//imports
const Home = require('../models/home');
const User = require('../models/user');
const path = require('path');
const rootDir = require('../utils/pathUtil');
const fs = require('fs/promises');
const { check, validationResult } = require("express-validator");

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
        res.status(500).render('error');
    }
};

exports.getHomeDetails = async (req, res) => {
    try {
        const homeId = req.params.homeId;
        const home = await Home.findById(homeId);
        const ownerId = home.owner.toString();
        const owner = await User.findOne({ _id: ownerId });

        const currentYear = new Date().getFullYear();
        const joinedYear = owner.joinedAt.getFullYear();
        const yearsHosting = currentYear - joinedYear;

        if (!home) {
            res.render("error.ejs");
        } else {
            res.render('store/home-details', {
                home,
                currentPage: 'home-details',
                isLoggedIn: req.isLoggedIn,
                user: req.session.user,
                owner,
                yearsHosting
            });
        }
    } catch (error) {
        console.log('Error while reading homeById', error);
        res.status(500).render('error');
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
    res.redirect('/user/home-list');
};

exports.getHostProfile = async (req, res) => {
    const hostId = req.params.id;
    const host = await User.findOne({ _id: hostId });
    const homes = await Home.find({ owner: hostId });
    const currentYear = new Date().getFullYear();
    const joinedYear = host.joinedAt.getFullYear();
    const yearsHosting = currentYear - joinedYear;

    res.render('store/hostProfile', {
        host,
        homes,
        currentPage: "Host Profile",
        isLoggedIn: req.isLoggedIn,
        user: req.session.user,
        yearsHosting
    });

}

exports.getSettings = async (req, res) => {
    const userId = req.session.user.id;
    const user = await User.findById(userId);
    res.render('store/userSettings', {
        currentPage: 'settings',
        isLoggedIn: req.isLoggedIn,
        user
    });
}

exports.postSettings = [
    check("firstName")
        .notEmpty()
        .withMessage("First name is required")
        .bail()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("First name must be between 2 and 100 characters")
        .bail()
        .matches(/^[A-Za-z]+$/)
        .withMessage("First name must contain only letters"),

    check("lastName")
        .notEmpty()
        .withMessage("Last name is required")
        .bail()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Last name must be between 2 and 100 characters")
        .bail()
        .matches(/^[A-Za-z]+$/)
        .withMessage("Last name must contain only letters"),

    check("email")
        .isEmail()
        .withMessage("Please enter a valid email")
        .normalizeEmail(),


    async (req, res) => {
        const { firstName, lastName, email, phoneNumber } = req.body;   
        const userId = req.session.user.id;
        const user = await User.findById(userId);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('store/userSettings', {
                currentPage: 'settings',
                isLoggedIn: req.isLoggedIn,
                user,
                errorMessages: [errors.array()[0].msg],
            });
        };

        let profilePicture = user.profilePicture;
        if (req.file) {
            profilePicture = '/' + req.file.path;
        }
        const updateFields = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phoneNumber: phoneNumber,
            profilePicture: profilePicture
        };
        const hostId = req.session.user.id;
        const updatedHost = await User.findOneAndUpdate(
            { _id: hostId },
            { $set: updateFields },
            { returnDocument: 'after' }
        );
        res.status(301).redirect('/user/settings');
    }]

exports.postDownloadRules = async (req, res) => {
    try {
        const homeId = req.params.homeId;
        const home = await Home.findById(homeId)
        const rules = home.rules || "No Rules and Guidelines have been set for this property yet.";

        const fileName = `rules-${homeId}.txt`;
        const filePath = path.join(rootDir, 'data', fileName);
        await fs.writeFile(filePath, rules);

        res.download(filePath, fileName, async (err) => {
            if (err) {
                console.log("Error while downloading file to client:", err);
            }
            try {
                await fs.unlink(filePath);
            } catch (unlinkErr) {
                console.error('Error deleting file:', unlinkErr.message);
            }
        });

    } catch (err) {
        console.error("Error generating rules file:", err);
        return res.render('error');
    }
};