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

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded());

const store = new MongoDBStore({
    uri: DB_PATH,
    collection: 'sessions',
});

app.use(session({
    secret: 'airbnb session',
    resave: false,
    saveUninitialized: true,
    store: store,
}))

app.use((req, res, next)=>{
    req.isLoggedIn = req.session.isLoggedIn;
    next();
});

app.get('/welcome', homes.getWelcome);
app.get('/', homes.getHome);

const requireAuth = (req, res, next) => {
    if (req.isLoggedIn) {
        return next();
    }
    return res.redirect('/login');
};

app.use('/host', requireAuth, hostRouter);
app.use('/user', requireAuth, userRouter);
app.use(authRouter);

app.use(express.static(path.join(rootDir, 'public')));

app.use(errors.get404)

const PORT = 8000;

mongoose.connect(DB_PATH).then(()=>{
    console.log("Connected to Mongoose");
    app.listen(PORT, () => {
        console.log(`Server running on PORT:${PORT}. Click here to visit http://localhost:${PORT}`);
    });
}).catch(err=>{
    console.log("Error while connecting to Mongoose", err);
});