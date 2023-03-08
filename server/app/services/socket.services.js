const { authJwt } = require('../middleware');
const chatController = require('../controllers/chat.controller');
const userController = require('../controllers/user.controller');
const contactController = require('../controllers/contact.controller');

exports.initalizeSockets = (http) => {
    const socketIO = require('socket.io')(http, {
        cors: {
            origin: ['http://localhost:3000', 'http://192.168.10.18:3000'],
        },
    });

    socketIO.on('connection', (socket, next) => {
        console.log(
            `⚡: Socket ID: ${socket.id}, user with id: ${socket.user} just connected!`
        );
        socket.join(socket.user);

        userController.setOnline(socket.user, true);

        contactController.findAllContacts(socket, next).then((contactsList) => {
            contactsList.forEach((data) =>
                socket
                    .to(data.contact.id)
                    .emit('activeUser', { userID: socket.user, isOnline: true })
            );
        });

        socket.on('sendMessage', (data) => {
            data['senderUserID'] = socket.user;
            chatController.create(data).then((newMessage) => {
                socketIO
                    .to(data.receiverUserID)
                    .to(data.senderUserID)
                    .emit('responseMessage', newMessage);
            });
        });

        socket.on('deleteMessage', (data) => {
            data['senderUserID'] = socket.user;
            chatController.delete(data).then(() => {
                socketIO
                    .to(data.receiverUserID)
                    .to(data.senderUserID)
                    .emit('onDeleteMessage', data.id);
            });
        });
        socket.on('addContact', (data) => {
            data['senderUserID'] = socket.user;
            contactController.create(data).then((newContact) => {
                contactController.findOne(newContact.id).then((newContact) => {
                    let contact1 = {
                        id: newContact.id,
                        additionalDescription: newContact.additionalDescription,
                        contact: newContact.owner,
                    };
                    let contact2 = {
                        id: newContact.id,
                        additionalDescription: newContact.additionalDescription,
                        contact: newContact.contact,
                    };
                    socketIO
                        .to(newContact.owner.id)
                        .emit('onAddNewContact', contact2);
                    socket
                        .to(newContact.contact.id)
                        .emit('onAddNewContact', contact1);
                });
            });
        });
        socket.on('deleteOneContact', (data) => {
            data['ownerID'] = socket.user;
            contactController.delete(data).then(() => {
                socketIO
                    .to(data.ownerID)
                    .emit('onDeleteOneContact', data.contactToDeleteID);
                socket
                    .to(data.contactToDeleteID)
                    .emit('onDeleteOneContact', data.ownerID);
            });
        });
        socket.on('disconnect', () => {
            socket.leave(socket.user);
            userController.setOnline(socket.user, false);
            contactController
                .findAllContacts(socket, next)
                .then((contactsList) => {
                    contactsList.forEach((data) =>
                        socket.to(data.contact.id).emit('activeUser', {
                            userID: socket.user,
                            isOnline: false,
                        })
                    );
                });
            console.log(`🔥: A user with id: ${socket.user} disconnected`);
        });
    });

    socketIO.use(async (socket, next) => {
        authJwt.verifyTokenSocket(socket, next);
    });
};
