'use strict';
module.exports = (sequelize, DataTypes) => {
  const messageCategory = sequelize.define('message_category', {
    name: {
      type: DataTypes.STRING
    },
  }, {
    freezeTableName: true,
    underscored: true,
  });

  
  return messageCategory;
};
