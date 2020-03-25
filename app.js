const express = require('express');
const db = require('./db');
const { Book } = db.models;

const app = express();

app.use('/static', express.static('public'));

app.set('view engine', 'pug');

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
    res.render('error');
});

// async IIFE
(async () => {
    // Sync 'Book' table
    await db.sequelize.sync({ force: true });

    try {
        const book = await Book.create({
            title: 'test',
            author: 'test',
            genre: 'test',
            year: 2020
        });

        console.log(book.toJSON());

    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => err.message);
            console.error('Validation Errors: ', errors);
        } else {
            throw error;
        }
    }
})();

app.listen(3000, () => {
    console.log('The application is running on localhost:3000!')
});