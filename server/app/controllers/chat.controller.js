const db = require('../models');
const ChatMessage = db.ChatMessage;
const ChatHeader = db.ChatHeader;
const Op = db.Sequelize.Op;

const checkChatHeaderExist = (firstUserID, secondUserID) => {
    return ChatHeader.count({
        where: {
            [Op.or]: [
                { firstUserID: firstUserID, secondUserID: secondUserID },
                { firstUserID: secondUserID, secondUserID: firstUserID },
            ],
        },
    }).then((count) => {
        if (count != 0) {
            return true;
        }
        return false;
    });
};

const createChatMessage = (senderUserID, message, initVector, chatHeaderID) => {
    return ChatMessage.create({
        chatHeaderID: chatHeaderID,
        senderUserID: senderUserID,
        message: message,
        initVector: initVector,
        receiveDate: '',
        readDate: '',
    }).then((data) => {
        return data;
    });
};

const createChatHeader = (senderUserID, receiverUserID) => {
    return ChatHeader.create({
        firstUserID: senderUserID,
        secondUserID: receiverUserID,
    }).then((data) => {
        return data;
    });
};

const findChatHeaderByUsersID = (firstUserID, secondUserID) => {
    return ChatHeader.findOne({
        where: {
            [Op.or]: [
                { firstUserID: firstUserID, secondUserID: secondUserID },
                { firstUserID: secondUserID, secondUserID: firstUserID },
            ],
        },
    }).then((data) => {
        return data;
    });
};

exports.create = (params) => {
    const receiverUserID = params.receiverUserID;
    const senderUserID = params.senderUserID;
    const message = params.message;
    const initVector = params.initVector;
    return checkChatHeaderExist(senderUserID, receiverUserID).then(
        (chatHeader) => {
            if (!chatHeader) {
                return createChatHeader(senderUserID, receiverUserID).then(
                    (createdChatHeader) => {
                        return createChatMessage(
                            senderUserID,
                            message,
                            initVector,
                            createdChatHeader.id
                        ).then((data) => {
                            return data;
                        });
                    }
                );
            } else {
                return findChatHeaderByUsersID(
                    senderUserID,
                    receiverUserID
                ).then((chatHeader) => {
                    return createChatMessage(
                        senderUserID,
                        message,
                        initVector,
                        chatHeader.id
                    ).then((data) => {
                        return data;
                    });
                });
            }
        }
    );
};

exports.getChat = (req, res) => {
    const sender = req.userId;
    const receiver = req.body.data.id;
    checkChatHeaderExist(sender, receiver).then((check) => {
        if (check) {
            findChatHeaderByUsersID(sender, receiver).then((chatHeader) => {
                ChatMessage.findAll({
                    where: {
                        chatHeaderID: chatHeader.id,
                    },
                }).then((data) => {
                    if (data) {
                        res.send(data);
                    } else {
                        res.send({
                            message: 'emptyHeader',
                        });
                    }
                });
            });
        } else {
            res.send({
                message: 'noHeader',
            });
        }
    });
};
exports.delete = (params) => {
    const id = params.id;
    return ChatMessage.destroy({
        where: {
            id: id,
        },
    });
};
