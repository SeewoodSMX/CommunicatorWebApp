module.exports = {
    HOST: 'server-name',
    USER: 'username',
    PASSWORD: 'password',
    DB: 'database-name',
    SCHEMA: 'schema-name',
    dialect: 'db-language',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
};
