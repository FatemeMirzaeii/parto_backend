'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('user', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      email: {
        unique: false,
        allowNull: true,
        type: Sequelize.STRING,
      },
      phone: {
        unique: false,
        allowNull: true,
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING
      },
      role_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "role",
          key: "id",
        },
        onDelete: "RESTRICT",
      },
      active: {
        type: Sequelize.BOOLEAN
      },
      uuid:{
        type:Sequelize.UUID
      },
      imei: {
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
    return queryInterface.dropTable('user');
  }
};