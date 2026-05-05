const { check, validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res) => {
    res.render('auth/login', {
        isLoggedIn: false,
        user: {},
    });
};

exports.postLogin = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
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
};

exports.postLogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('login');
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