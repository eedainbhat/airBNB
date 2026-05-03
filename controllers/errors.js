//imports
const path = require('path');
const rootDir = require('../utils/pathUtil');

exports.get404 = (req, res) => {
    res.status(404).render('404', {
        isLoggedIn: req.isLoggedIn,
    });
}