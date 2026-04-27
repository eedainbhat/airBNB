const express = require('express');
const {hostRouter} = require('./routes/hostRouter');
const {userRouter} = require('./routes/userRouter');
const path = require('path');
const rootDir = require('./utils/pathUtil')
const homes = require('./controllers/homes');
const errors = require('./controllers/errors');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded());

app.get('/', homes.getHome);

app.use('/host', hostRouter);
app.use('/user', userRouter);

app.use(express.static(path.join(rootDir, 'public')));

app.use(errors.get404)

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server running on PORT:${PORT}. Click here to visit http://localhost:${PORT}`);
}); 