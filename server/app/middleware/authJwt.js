const jwt = require('jsonwebtoken');
const config = require('../config/auth.config.js');

verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'];

    if (!token) {
        return res.status(403).send({
            message: 'No token provided!',
        });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: 'Unauthorized!',
            });
        }

        req.userId = decoded.id;
        next();
    });
};

verifyTokenSocket = (socket, next) => {
    const token = socket.handshake.auth.token; //for client react
    //const token = socket.handshake.headers.token; //for postman requests

    if (!token) {
        return next(new Error('No token provided to socket!'));
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return next(new Error('Unauthorized!'));
        }

        socket.user = decoded.id;
        next();
    });
};

const authJwt = {
    verifyToken: verifyToken,
    verifyTokenSocket: verifyTokenSocket,
};
module.exports = authJwt;
