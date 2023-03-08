const { authJwt } = require('../middleware');
const users = require('../controllers/user.controller.js');

module.exports = (app) => {
    let router = require('express').Router();
    app.use(function (req, res, next) {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept'
        );
        next();
    });
    // Retrieve all users
    router.get('/', [authJwt.verifyToken], users.findAll);

    // Retrieve a single User with id
    router.get('/:id', [authJwt.verifyToken], users.findOne);

    // Update a User
    router.put('/', [authJwt.verifyToken], users.update);

    // Delete a User with id
    router.delete('/:id', [authJwt.verifyToken], users.delete);

    // Create a new User
    router.delete('/', [authJwt.verifyToken], users.deleteAll);

    app.use('/api/users', router);
};
