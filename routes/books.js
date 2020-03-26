const express = require('express');
const router = express.Router();
const db = require('../db');
const { Book } = db.models;

// Handler for each route
function asyncHandler(cb) {
    return async(req, res, next) => {
        try {
            await cb(req, res, next)
        } catch(error) {
            res.status(500).send(error);
        }
    }
}

/* GET home page. */
router.get('/', (req, res) => {
    res.redirect("/books");
});

// Book list
router.get('/books', asyncHandler( async (req, res) => {
    const books = await Book.findAll();
    res.render("index", { books, title: "Books" });
}));

// Create a new book
router.get('/books/new', (req, res) => {
    res.render("new-book", { book: {}, title: "New Book"});
});

// POST new book
router.post('/books/new', asyncHandler(async (req, res) => {
    let book;
    try {
        book = await Book.create(req.body);
        res.redirect('/books');
    } catch (error) {
        if(error.name === "SequelizeValidationError") {
            book = await Book.build(req.body);
            res.render('new-book', { book, errors: error.errors, title: "New Book"});
        } else {
            throw error;
        }
    }
}));

// GET book detail
router.get('/books/:id/',asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if(book) {
        res.render("update-book", { book, title: "Update Book"});
    } else {
        res.render('page-not-found', { error: { message: "Page Not Found", status: 404}});
    }    
}));

// Update book detail
router.post('/books/:id', asyncHandler(async (req, res) => {
    let book;
    try {
        book = await Book.findByPk(req.params.id);
        if(book) {
            await book.update(req.body);
            res.redirect('/books'); 
        } else {
            res.render(404);
        }
    } catch (error) {
        if(error.name === "SequelizeValidationError") {
            book = await Book.build(req.body);
            book.id = req.params.id;
            res.render("update-book", { book, errors: error.errors, title: "Update Book" })
          } else {
            throw error;
          }
    }
}));

// Delete book
router.post('/books/:id/delete', asyncHandler (async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if(book) {
        await book.destroy();
        res.redirect("/books");
    } else {
        res.sendStatus(404);
    }
}));

module.exports = router;

