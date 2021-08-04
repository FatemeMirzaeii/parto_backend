'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('message', {
    title: {
      type: DataTypes.STRING,
      validate: {
        max: 1024,
      },
    },
    content: {
      type: DataTypes.STRING
    }
  }, {
    freezeTableName: true,
    underscored: true,
  });
  Message.associate = function (models) {
    Message.belongsTo(models.message, {
      foreignKey: "parent_message_id",
      onDelete: "RESTRICT"
    });
    Message.belongsTo(models.user,{
      foreignKey: "user_id",
      onDelete: "RESTRICT"
    })
  };
  return Message;
};