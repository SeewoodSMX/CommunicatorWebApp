const { authJwt } = require('../middleware');
const chat = require('../controllers/chat.controller.js');

module.exports = (app) => {
    var router = require('express').Router();
    app.use(function (req, res, next) {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept'
        );
        next();
    });

    router.post('/', [authJwt.verifyToken], chat.getChat);

    app.use('/api/chat', router);
};
