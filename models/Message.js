'use strict';
module.exports = (sequelize, DataTypes) => {
  const message = sequelize.define('message', {
    content:{
      type: DataTypes.TEXT,
    },
    type:{
      type: DataTypes.ENUM('text', 'file','voice','startForm', 'delayForm' , 'offlineForm'),
    },
    sender_id:{
      type: DataTypes.INTEGER ,
    },
    receiver_id:{
      type: DataTypes.INTEGER ,
    },
  }, {
    freezeTableName: true,
    underscored: true,
  });
  message.associate = function (models) {
    
  };
  return message;
};