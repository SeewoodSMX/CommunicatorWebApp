const { authJwt } = require('../middleware');
const contacts = require('../controllers/contact.controller.js');

module.exports = (app) => {
    var router = require('express').Router();
    app.use(function (req, res, next) {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept'
        );
        next();
    });

    // Retrieve all contacts of logged user (request has userID)
    router.get('/', [authJwt.verifyToken], contacts.findAll);

    // Create a contact with id (Dodanie kontaktu)
    router.put('/:id', [authJwt.verifyToken], contacts.create);

    // // Delete a contact with id
    // router.delete("/:id", [authJwt.verifyToken], contacts.delete);

    app.use('/api/contacts', router);
};
