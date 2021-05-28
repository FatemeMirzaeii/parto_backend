'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('message', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      content:{
        type: Sequelize.TEXT,
        allowNull: false, 
      },
      type:{
        type: Sequelize.ENUM('text', 'file','voice','startForm', 'delayForm' , 'offlineForm'),
        allowNull: false,
      },
      sender_id:{
        type: Sequelize.INTEGER ,
        allowNull: false,
      },
      receiver_id:{
        type: Sequelize.INTEGER ,
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('message');
  }
};