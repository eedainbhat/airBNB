const { check, validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require('bcryptjs');
const path = require('path');
const rootDir = require('../utils/pathUtil');
const fs = require('fs/promises');


exports.getWelcome = (req, res) => {
    res.render('welcome', {
        isLoggedIn: false,
        user: {},
    })
};

exports.getLogin = (req, res) => {
    res.render('auth/login', {
        isLoggedIn: false,
        user: {},
    });
};

exports.postLogin = [
    check("email")
        .notEmpty()
        .withMessage("Email is required")
        .bail()
        .isEmail()
        .withMessage("Please enter a valid email")
        .normalizeEmail(),
    check("password")
        .notEmpty()
        .withMessage("Password is required")
        .bail()
        .trim(),


    async (req, res) => {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).render('auth/login', {
                errorMessages: [errors.array()[0].msg],
                oldInput: { email }
            });
        }

        if (!user) {
            return res.status(422).render('auth/login', {
                errorMessages: ["Invalid email or password"],
                oldInput: { email }
            });
        } else {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(422).render('auth/login', {
                    errorMessages: ["Invalid email or password"],
                    oldInput: { email }
                });
            }
        }

        req.session.isLoggedIn = true;
        req.session.user = {
            id: user._id.toString(),
            accountType: user.accountType,
            email: user.email
        };

        req.session.save((err) => {
            if (err) {
                console.log("MONGO ERROR!", err);
            }
            res.redirect('/');
        });
    }];

exports.postLogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    })
};

exports.getLogout = (req, res) => {
    res.render('auth/logout', {
        user: req.session.user
    });
};

exports.getSignup = (req, res) => {
    res.render('auth/signup', {
        isLoggedIn: false,
        user: {},
    });
};

exports.postSignup = [
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

    check("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long")
        .bail()
        .matches(/[a-z]/)
        .withMessage("Password must contain at least one lowercase letter")
        .bail()
        .matches(/[A-Z]/)
        .withMessage("Password must contain at least one uppercase letter")
        .bail()
        .matches(/[0-9]/)
        .withMessage("Password must contain at least one number")
        .trim(),

    check("confirmPassword")
        .trim()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Passwords do not match");
            }
            return true;
        }),

    check('accountType')
        .notEmpty()
        .withMessage("Please select an account type")
        .bail()
        .isIn(['host', 'traveler'])
        .withMessage("Invalid account type"),

    check("terms")
        .notEmpty()
        .withMessage("You must agree to the terms and conditions")
        .bail()
        .custom((value) => {
            if (value !== "on") {
                throw new Error("You must agree to the terms and conditions");
            }
            return true;
        }),

    (req, res) => {
        const { firstName, lastName, email, password, accountType } = req.body;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).render('auth/signup', {
                errorMessages: [errors.array()[0].msg],
                oldInput: {
                    firstName,
                    lastName,
                    email,
                    password,
                    accountType
                }
            });
        };

        bcrypt.hash(password, 12).then(hashedPassword => {
            const user = new User({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                accountType
            });
            return user.save();
        }).then(() => {
            res.redirect('/login');
        }).catch((err) => {
            return res.status(422).render('auth/signup', {
                errorMessages: [err.message],
                oldInput: {
                    firstName,
                    lastName,
                    email,
                    password,
                    accountType
                }
            });
        })
    }
];

exports.getChangePassword = async (req, res) => {
    res.render('auth/changePassword', {
        currentPage: "change-password",
        isLoggedIn: req.isLoggedIn,
        user: req.session.user,
        errorMessages: false,
    });
};

exports.postChangePassword = [
    check("newPassword")
        .notEmpty()
        .withMessage("New password is required")
        .bail()
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long")
        .bail()
        .matches(/[a-z]/)
        .withMessage("Password must contain at least one lowercase letter")
        .bail()
        .matches(/[A-Z]/)
        .withMessage("Password must contain at least one uppercase letter")
        .bail()
        .matches(/[0-9]/)
        .withMessage("Password must contain at least one number")
        .trim(),

    check("confirmPassword")
        .notEmpty()
        .withMessage("Please confirm your new password")
        .bail()
        .trim()
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error("Passwords do not match");
            }
            return true;
        }),

    async (req, res) => {
        console.log("🚨 THE ROUTE WAS HIT! I AM ALIVE! 🚨"); // ADD THIS!
        console.log("INCOMING BODY:", req.body); // Let's see what the form sent
        try {
            const { currentPassword, newPassword, confirmPassword } = req.body;

            const errors = validationResult(req);

            console.log("RAW EXPRESS ERRORS:", errors.array());
            if (!errors.isEmpty()) {

                return res.status(422).render('auth/changePassword', {
                    currentPage: "change-password",
                    isLoggedIn: req.isLoggedIn,
                    user: req.session.user,
                    errorMessages: [errors.array()[0].msg],
                    oldInput: { currentPassword, newPassword, confirmPassword }
                });
            }

            const userId = req.session.user.id;
            const user = await User.findById(userId);

            const isMatch = await bcrypt.compare(currentPassword, user.password);

            if (!isMatch) {
                return res.status(422).render('auth/changePassword', {
                    currentPage: "change-password",
                    isLoggedIn: req.isLoggedIn,
                    user: req.session.user,
                    errorMessages: ["The current password you entered is incorrect"],
                    oldInput: { currentPassword, newPassword, confirmPassword }
                });
            }

            const hashedNewPassword = await bcrypt.hash(newPassword, 12);
            user.password = hashedNewPassword;
            await user.save();

            res.redirect('/');

        } catch (err) {
            console.log("Error in change password: ", err);
            res.redirect('/error');
        }
    }
];

exports.postDeleteAccount = async (req, res) => {
    const hostId = req.session.user.id;
    const host = await User.findOneAndDelete({ _id: hostId });
    req.session.destroy(() => {
        res.redirect('/login');
    })
};

exports.postDeletePfp = async (req, res) => {
    try {
        const userId = req.params.userId; 
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).render('error');
        }

        if (user.profilePicture !== '/images/default-pfp.webp') {
            const oldImagePath = path.join(rootDir, user.profilePicture.substring(1));
            fs.unlink(oldImagePath).catch((err) => {
                console.log("Error while deleting previous photo:", err);
            });
        }
        
        user.profilePicture = '/images/default-pfp.webp';
        await user.save();
        
        if (user.accountType === 'host') {
            res.redirect('/host/profile-dashboard');
        } else {
            res.redirect('/user/settings');
        }
    } catch (error) {
        console.log("Error inside postDeletePfp:", error);
        res.status(500).render('error');
    }
};