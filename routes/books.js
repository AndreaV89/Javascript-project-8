const express = require('express');
const router = express.Router();
const db = require('../db');
const { Book } = db.models;
const { Op } = db.Sequelize;

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
    res.redirect("/books/page/1");
}));

// Pagination Routes
router.get('/books/page/:pageNumber', asyncHandler( async (req, res) => {
    const booksNumber = await Book.count();
    const booksPerPage = 5;
    const numberOfPage = booksNumber / booksPerPage;
    const offset = booksPerPage * (req.params.pageNumber - 1);
    const books = await Book.findAll({offset, limit: booksPerPage});
    if(books.length != 0) {
        res.render("index", { books, title: "Books" , numberOfPage});
    } else {
        res.render('page-not-found', { error: { message: "Page Not Found", status: 404}});
    } 
}))

// Search Book
router.get('/books/search', asyncHandler( async (req, res) => {
    const books = await Book.findAll({
        where: { 
            [Op.or]: [
                {title: { [Op.like]: '%' + req.query.search + '%' }},
                {author: { [Op.like]: '%' + req.query.search + '%' }},
                {genre: { [Op.like]: '%' + req.query.search + '%'}},
                {year: req.query.search}
            ]
        }
    });
    res.render("search", { books, title: "Search Books" , searchTerm: req.query.search});
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

