module.exports = (sequelize, Sequelize) => {
    const ChatMessage = sequelize.define('chat_message', {
        message: {
            type: Sequelize.TEXT,
            allowNull: false,
        },
        initVector: {
            type: Sequelize.STRING,
        },
        sendDate: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: Sequelize.fn('now'),
        },
        receiveDate: {
            type: Sequelize.STRING,
        },
        readDate: {
            type: Sequelize.STRING,
        },
        status: {
            type: Sequelize.STRING,
            defaultValue: 'NEW',
        },
    });

    return ChatMessage;
};
