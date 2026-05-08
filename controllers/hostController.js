//imports
const { check, validationResult } = require('express-validator');
const Home = require('../models/home');
const user = require('../models/user');
const User = require('../models/user');


exports.postHomeAdded = [
    check("name")
        .notEmpty()
        .withMessage("House name is required")
        .bail()
        .trim()
        .isLength({ min: 4, max: 100 })
        .withMessage("House name must be between 4 and 100 characters")
        .bail(),
    check("price")
        .notEmpty()
        .withMessage("Price is required")
        .bail()
        .isNumeric()
        .withMessage("Price must be a number")
        .bail(),
    check("location")
        .notEmpty()
        .withMessage("Location is required")
        .bail()
        .trim()
        .isLength({ min: 8, max: 100 })
        .withMessage("Location must be between 8 and 100 characters")
        .bail(),
    check("description")
        .notEmpty()
        .withMessage("Description is required")
        .bail()
        .trim()
        .isLength({ min: 10, max: 1000 })
        .withMessage("Description must be between 10 and 1000 characters")
        .bail(),

    (req, res) => {
        const owner = req.session.user.id;
        const { name, price, location, description, } = req.body;
        const errors = validationResult(req);

        if (!req.file) {
            return res.status(400).render('host/addHome', {
                currentPage: 'add-home',
                isLoggedIn: req.isLoggedIn,
                user: req.session.user,
                errorMessages: ["Please upload a photo of the house!"],
                oldInput: { name, price, location, description }
            });
        }

        const photo = '/' + req.file.path;

        if (!errors.isEmpty()) {
            return res.status(400).render('host/addHome', {
                currentPage: 'add-home',
                isLoggedIn: req.isLoggedIn,
                user: req.session.user,
                errorMessages: [errors.array()[0].msg],
                oldInput: {
                    name,
                    price,
                    location,
                    description
                }
            });
        }

        const home = new Home({ name, price, location, photo, description, owner });
        home.save().then(() => {
            res.render('host/homeAdded', {
                isLoggedIn: req.isLoggedIn,
                user: req.session.user
            });
        }).catch(error => {
            console.log('Error while adding home', error);
            res.status(500).render('error');
        });
    }];


exports.getHostHome = (req, res) => {
    res.render('host/hostHome', {
        currentPage: 'home',
        isLoggedIn: req.isLoggedIn,
        user: req.session.user
    })
};

exports.getAddHome = (req, res) => {
    res.render('host/addHome', {
        currentPage: 'add-home',
        isLoggedIn: req.isLoggedIn,
        user: req.session.user,
        errorMessages: false,
        oldInput: {
            name: '',
            price: '',
            location: '',
            description: ''
        }
    });
};

exports.getEditHomes = (req, res) => {
    const homeId = req.params.homeId;
    Home.findById(homeId).then(home => {
        res.render("host/edit-home", { home, currentPage: 'edit-home', isLoggedIn: req.isLoggedIn, user: req.session.user })
    }).catch(error => {
        console.log('Error while updating home', error);
        res.status(500).render('error');
    });
};

exports.getHostHomelist = (req, res) => {
    const ownerId = req.session.user.id;
    Home.find({ owner: ownerId }).then((homelist) => {
        res.render('host/host-homelist', { homelist, currentPage: 'home-list', isLoggedIn: req.isLoggedIn, user: req.session.user });
    }).catch(error => {
        console.log('Error while getting homelist', error);
        res.status(500).render('error');
    });
};

exports.postEditHomes = [
    check("name")
        .notEmpty()
        .withMessage("House name is required")
        .bail()
        .trim()
        .isLength({ min: 4, max: 100 })
        .withMessage("House name must be between 4 and 100 characters")
        .bail(),
    check("price")
        .notEmpty()
        .withMessage("Price is required")
        .bail()
        .isNumeric()
        .withMessage("Price must be a number")
        .bail(),
    check("location")
        .notEmpty()
        .withMessage("Location is required")
        .bail()
        .trim()
        .isLength({ min: 8, max: 100 })
        .withMessage("Location must be between 8 and 100 characters")
        .bail(),
    check("description")
        .notEmpty()
        .withMessage("Description is required")
        .bail()
        .trim()
        .isLength({ min: 10, max: 1000 })
        .withMessage("Description must be between 10 and 1000 characters")
        .bail(),




    (req, res) => {
        const { name, price, location, description } = req.body;
        const homeId = req.body.homeId;
        const currentUserId = req.session.user.id;
        const errors = validationResult(req);

        Home.findOne({ _id: homeId, owner: currentUserId }).then((home) => {
            if (!home) {
                return res.status(404).render('error');
            }
            if (!errors.isEmpty()) {
                return res.status(400).render('host/edit-home', {
                    currentPage: 'edit-home',
                    isLoggedIn: req.isLoggedIn,
                    user: req.session.user,
                    errorMessages: [errors.array()[0].msg],
                    home,
                });
            }

            home.name = name;
            home.price = price;
            home.location = location;
            if (req.file) {
                home.photo = '/' + req.file.path;
            }
            home.description = description;
            return home.save()
                .then((updatedHome) => {
                    res.redirect("/host/host-homelist");
                }).catch(error => {
                    console.log('Error while updating home', error);
                    res.status(500).render('error');
                });
        }).catch(error => {
            console.log('Error while updating home', error);
            res.status(500).render('error');
        });
    }];

exports.postDeleteHome = (req, res) => {
    const homeId = req.params.homeId;
    const currentUserId = req.session.user.id;
    const returnTo = req.body.returnTo || "/host/host-homelist";
    Home.findOneAndDelete({ _id: homeId, owner: currentUserId }).then((home) => {
        res.redirect(returnTo);
    }).catch(error => {
        console.log('Error while reading homeById', error);
        res.status(500).render('error');
    });
};

exports.getProfileDashboard = async (req, res) => {
    const hostId = req.session.user.id;
    const host = await User.findOne({ _id: hostId });
    const homes = await Home.find({ owner: hostId });
    const currentYear = new Date().getFullYear();
    const joinedYear = host.joinedAt.getFullYear();
    const yearsHosting = currentYear - joinedYear;

    res.render('host/profileDashboard', {
        currentPage: 'profile-dashboard',
        isLoggedIn: req.isLoggedIn,
        host,
        homes,
        yearsHosting,
    });
};

exports.getEditProfile = async (req, res) => {
    const hostId = req.session.user.id;
    const host = await User.findOne({ _id: hostId });

    res.render('host/editProfile', {
        currentPage: 'edit-profile',
        isLoggedIn: req.isLoggedIn,
        host,
    });
};

exports.postEditProfile = async (req, res) => {
    const { firstName, lastName, bio } = req.body;
    const hostId = req.session.user.id;
    const host = await User.findOne({ _id: hostId });
    let profilePicture = host.profilePicture;
    if (req.file) {
        profilePicture = '/' + req.file.path;
    }
    const updateFields = {
        firstName: firstName,
        lastName: lastName,
        bio: bio,
        profilePicture: profilePicture
    };
    const updatedHost = await User.findOneAndUpdate(
        { _id: hostId },
        { $set: updateFields },
        { returnDocument: 'after' }
    );
    res.status(301).redirect('/host/profile-dashboard');
};

exports.getAddRules = async (req, res) => {
    const homeId = req.params.homeId;
    const home = await Home.findById(homeId);
    res.render('host/add-rules', {
        currentPage: 'edit-profile',
        isLoggedIn: req.isLoggedIn,
        host: req.session.user,
        home
    });

};

exports.postAddRules = async (req, res) => {
    const rules = req.body.rules.trim();
    const homeId = req.params.homeId;
    try {
        const home = await Home.findById(homeId);
        if (!home) {
            return res.status(404).render('error');
        }

        if (rules) {
            home.rules = rules;
            await home.save();
        }

        res.redirect('/host/host-homelist');
    } catch (error) {
        console.log('Error while adding rules', error);
        res.status(500).render('error');
    }
};