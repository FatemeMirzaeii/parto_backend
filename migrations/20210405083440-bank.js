'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('bank', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      invoice_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "invoice",
          key: "id",
          as:"invoice_id"
        },
        onDelete: "CASCADE",
      },
      card_pan:{
        type: Sequelize.STRING
      },
      card_hash:{
        type: Sequelize.STRING
      },
      order_id:{
        type: Sequelize.INTEGER
      },
      gateway:{
        type: Sequelize.ENUM('zp'),
        allowNull: false,
        defaultValue: 'zp',
      },
      status:{
        type: Sequelize.ENUM('Success', 'UnSuccess','Reversed'),
        allowNull: false,
      },
      status_description:{
        type: Sequelize.STRING
      },
      authority:{
        type: Sequelize.STRING
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
    return queryInterface.dropTable('bank');
  }
};