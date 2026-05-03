
exports.getLogin = (req, res) => {
    res.render('login', {
        isLoggedIn: false,
    });
};

exports.postLogin = (req, res) => {
    req.session.isLoggedIn = true;
    res.redirect('/');
};

exports.postLogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    })
};

exports.getLogout = (req, res) => {
    res.render('logout');
};