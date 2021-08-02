'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('invoice', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      service_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "service",
          key: "id",
          as:"service"
        },
        onDelete: "CASCADE",
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
      method:{
        type: Sequelize.ENUM('gateway', 'wallet'),
        allowNull: false,
      },
      status:{
        type: Sequelize.ENUM('Success', 'UnSuccess','wating to pay'),
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
    return queryInterface.dropTable('transaction');
  }
};