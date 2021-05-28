'use strict';
module.exports = (sequelize, DataTypes) => {
  const messageInfo = sequelize.define('message_info', {
    status: {
      type: DataTypes.BOOLEAN
    },
    total_question:{
      type: DataTypes.INTEGER ,
    },
  }, {
    freezeTableName: true,
    underscored: true,
  });

  messageInfo.associate = function (models) {
    messageInfo.belongsTo(models.user, {
      foreignKey: "user_id",
      onDelete: "CASCADE",
    });
    messageInfo.belongsTo(models.message_category, {
        foreignKey: "category_id",
        onDelete: "CASCADE",
      });
 };
  
  return messageInfo;
};