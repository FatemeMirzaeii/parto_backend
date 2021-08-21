'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('discount_per_service', {
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
          as: "service"
        },
        onDelete: "CASCADE",
      },
      status: {
        type: Sequelize.ENUM('Active', 'Inactive'),
        allowNull: false,
        defaultValue: 'Active',
      },
      discount_type: {
        type: Sequelize.ENUM('Percent', 'Dollar', 'Rials'),
        allowNull: false,
        defaultValue: 'Percent',
      },
      discount_value: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      number_of_discount: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      start_time: {
        allowNull: true,
        type: Sequelize.DATE
      },
      end_time: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('discount_per_service');
  }
};