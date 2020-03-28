// Require Express, the database and routes
const express = require('express');
const db = require('./db');
const mainRoutes = require('./routes/books');

// Create che app
const app = express();

// Use the /public folder for static files
app.use('/static', express.static('public'));

// Set the view engine to 'Pug'
app.set('view engine', 'pug');

// Use body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use routes
app.use(mainRoutes);

// Errors handling middleware
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

// The app will listen on port 3000
app.listen(3000, () => console.log('The application is running on localhost:3000!'));