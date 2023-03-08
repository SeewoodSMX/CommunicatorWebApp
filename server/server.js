const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const socketService = require('./app/services/socket.services');

const app = express();

var corsOptions = {
    origin: ['http://localhost:3000', 'http://192.168.10.18:3000'],
};
const http = require('http').Server(app);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require('./app/models');
db.sequelize
    .sync()
    .then(() => {
        console.log('Synced db.');
    })
    .catch((err) => {
        console.log('Failed to sync db: ' + err.message);
    });

socketService.initalizeSockets(http);

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/contact.routes')(app);
require('./app/routes/chat.routes')(app);

const PORT = process.env.PORT || 8080;

http.listen(PORT, () => {
    console.log(`Server http is running on port ${PORT}.`);
});
