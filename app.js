const express = require('express');
const { hostRouter } = require('./routes/hostRouter');
const { userRouter } = require('./routes/userRouter');
const { authRouter } = require('./routes/authRouter');
const path = require('path');
const rootDir = require('./utils/pathUtil')
const homes = require('./controllers/homes');
const errors = require('./controllers/errors');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
require('dotenv').config();
const DB_PATH = process.env.MONGO_URI;
const SESSION_SECRET = process.env.secret;
const multer = require('multer');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const multerOptions = {
    dest: "uploads/",
}

app.use(express.static(path.join(rootDir, 'public')));
app.use('/uploads', express.static(path.join(rootDir, 'uploads')));
app.use(express.urlencoded({ extended: true }));

const store = new MongoDBStore({
    uri: DB_PATH,
    collection: 'sessions',
});

app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
}))

app.use((req, res, next) => {
    req.isLoggedIn = req.session.isLoggedIn || false;
    const publicPaths = ['/welcome', '/login', '/signup'];
    if (!req.isLoggedIn && !publicPaths.includes(req.path)) {
        return res.redirect("/welcome");
    } 
    next();
});

const requireAuth = (req, res, next) => {
    if (req.isLoggedIn) {
        return next();
    }
    return res.redirect('/welcome');
};

const isTraveler = (req, res, next) => {
    if (req.session.user && req.session.user.accountType === "traveler") {
        return next();
    }
    res.redirect('/');
};

const isHost = (req, res, next) => {
    if (req.session.user && req.session.user.accountType === "host") {
        return next();
    }
    res.redirect('/');
};

app.get('/', homes.getHome);
app.use('/user', requireAuth, isTraveler, userRouter);
app.use('/host', requireAuth, isHost, hostRouter);
app.use(authRouter);


app.use(errors.get404)

const PORT = 7200;

mongoose.connect(DB_PATH).then(() => {
    console.log("Connected to Mongoose");
    app.listen(PORT, () => {
        console.log(`Server running on PORT:${PORT}. Click here to visit http://localhost:${PORT}`);
    });
}).catch(err => {
    console.log("Error while connecting to Mongoose", err);
});