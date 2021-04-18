'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ledger', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "user",
          key: "id",
          as:"user_id"
        },
        onDelete: "CASCADE",
      },
      services_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "service",
          key: "id",
          as:"services_id"
        },
        onDelete: "CASCADE",
      },
      description:{
        type: Sequelize.STRING
      },
      transaction_type:{
        type: Sequelize.ENUM('Debtor', 'Creditor')
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
    return queryInterface.dropTable('ledger');
  }
};