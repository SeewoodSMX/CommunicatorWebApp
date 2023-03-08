module.exports = (sequelize, Sequelize) => {
  const ChatHeader = sequelize.define("chat_header", {
    status: {
      type: Sequelize.STRING,
      defaultValue: "ACTIVE",
    },
  });

  return ChatHeader;
};
