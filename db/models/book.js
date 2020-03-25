const Sequelize = require ('sequelize');

module.exports = (sequelize) => {
    class Book extends Sequelize.Model {}
    Book.init({
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Please provide a value for "Title"',
                }
            },
        },
        author: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Please provide a value for "Author"',
                },
            },
        },
        genre: {
            type: Sequelize.STRING
        },
        year: {
            type: Sequelize.INTEGER,
            validate: {
                max: {
                    args: 2020,
                    msg: 'Please provide a value lower than "2021" for "Year"',
                }
            }
        }
    }, { sequelize });

    return Book;
};