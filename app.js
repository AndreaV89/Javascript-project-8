const express = require('express');
const db = require('./db');
const { Book } = db.models;

const app = express();

app.use('/static', express.static('public'));

app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const mainRoutes = require('./routes/books');

app.use(mainRoutes);

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.locals.error = err;
    res.status(err.status);
    res.render('page-not-found');
});

// async IIFE
(async () => {
    // Sync 'Book' table
    await db.sequelize.sync();
})();

app.listen(3000, () => {
    console.log('The application is running on localhost:3000!')
});