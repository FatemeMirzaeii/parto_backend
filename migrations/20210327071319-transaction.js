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
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "user",
          key: "id",
          as:"user_id"
        },
        onDelete: "CASCADE",
      },
      amount: {
        type: Sequelize.INTEGER
      },
      description:{
        type: Sequelize.STRING
      },
      card_pan:{
        type: Sequelize.STRING
      },
      card_hash:{
        type: Sequelize.STRING
      },
      transaction_number:{
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('transaction');
  }
};