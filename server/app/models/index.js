const dbConfig = require('../config/db.config.js');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
    schema: dbConfig.SCHEMA,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle,
    },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./user.model.js')(sequelize, Sequelize);
db.Contact = require('./contact.model.js')(sequelize, Sequelize);
db.ChatHeader = require('./chatHeader.model.js')(sequelize, Sequelize);
db.ChatMessage = require('./chatMessage.model.js')(sequelize, Sequelize);

db.Contact.belongsTo(db.User, { as: 'owner', foreignKey: 'ownerID' });
db.Contact.belongsTo(db.User, { as: 'contact', foreignKey: 'contactID' });

db.ChatHeader.hasMany(db.ChatMessage, {
    as: 'chatMessages',
    foreignKey: 'chatHeaderID',
});
db.ChatHeader.belongsTo(db.User, {
    as: 'firstUser',
    foreignKey: 'firstUserID',
});
db.ChatHeader.belongsTo(db.User, {
    as: 'secondUser',
    foreignKey: 'secondUserID',
});

db.ChatMessage.belongsTo(db.User, { as: 'sender', foreignKey: 'senderUserID' });
module.exports = db;
