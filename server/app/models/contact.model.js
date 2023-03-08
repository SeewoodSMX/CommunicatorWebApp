module.exports = (sequelize, Sequelize) => {
  const Contact = sequelize.define("users_contacts", {
    additionalDescription: {
      type: Sequelize.STRING,
    },
    //Ids użytkowników powiązanych są generowane w index.js
  });

  return Contact;
};
