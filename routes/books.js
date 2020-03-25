const express = require('express');
const router = express.Router();
const Book = require('../db/models/book').Book;

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
router.get('/books', asyncHandler(async (req, res) => {
    const books = await Book.findAll();
    console.log(books.toJSON());
    res.render("index", { books, title: "Books"});
}));

// Create a new book
router.get('/books/new', (req, res) => {
    res.render("new-book", { book: {}, title: "New Book"});
});

// POST new article
router.post('/books/new', asyncHandler(async (req, res) => {
    res.redirect("/books");
}));

// GET book detail
router.get('/books/:id', asyncHandler(async (req, res) => {
    res.render("update-book");
}));

// Update book detail
router.post('/books/:id', asyncHandler(async (req, res) => {
    res.redirect("/books");
}));

// Delete book
router.post('/books/:id/delete', asyncHandler(async (req, res) => {
    res.redirect("/books")
}));

module.exports = router;

