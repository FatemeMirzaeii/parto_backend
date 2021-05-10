'use strict';
module.exports = (sequelize, DataTypes) => {
  const messageStatus = sequelize.define('message_status', {
    status: {
      type: DataTypes.BOOLEAN
    },
    category_id: {
      type: DataTypes.STRING
    },
  }, {
    freezeTableName: true,
    underscored: true,
  });

  messageStatus.associate = function (models) {
    messageStatus.belongsTo(models.user, {
      foreignKey: "user_id",
      onDelete: "CASCADE",
    });
    messageStatus.belongsTo(models.message_category, {
        foreignKey: "category_id",
        onDelete: "CASCADE",
      });
 };
  
  return messageStatus;
};