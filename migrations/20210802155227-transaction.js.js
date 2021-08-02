'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('transaction', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      wallet_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "wallet",
          key: "id",
          as:"wallet_id"
        },
        onDelete: "CASCADE",
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
      amount:{
        type: Sequelize.STRING
      },
      description:{
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
    return queryInterface.dropTable('transaction');
  }
};