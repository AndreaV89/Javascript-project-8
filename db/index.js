const Sequelize = require('sequelize');

/* Create a Sequelize instance and connect to the database library.db */
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'library.db',
  logging: false
});

const db = {
  sequelize,
  Sequelize,
  models: {},
};

db.models.Book = require('./models/book.js') (sequelize);

module.exports = db;