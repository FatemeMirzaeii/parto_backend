'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('service', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.ENUM('virtual S', 'real S', 'Physical P'),
        allowNull: false,
        defaultValue: 'virtual S',
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      commision: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      discount:{
        type: Sequelize.INTEGER,
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
    return queryInterface.dropTable('service');
  }
};