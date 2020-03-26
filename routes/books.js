const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../db');
const { Book } = db.models;

const jsonParser = bodyParser.json();

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
    res.render("index", { books: books, title: "Books" });
}));

// Create a new book
router.get('/books/new', (req, res) => {
    res.render("new-book", { book: {}, title: "New Book"});
});

// POST new book
router.post('/books/new', asyncHandler(async (req, res) => {
    const book = await Book.create({title: "test10", author: "test10"});
    console.log(req.body);
    res.redirect('/books/' + book.id)
}));

// GET book detail
router.get('/books/:id/',asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if(book) {
        res.render("update-book", { book, title: "Update Book"});
    } else {
        res.sendStatus(404);
    }    
}));

// Update book detail
router.post('/books/:id', (req, res) => {
    res.redirect("/books");
});

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

