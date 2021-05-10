'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('message_status', {
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
      category_id: {
        type: Sequelize.INTEGER ,
        references: {
          model: "message_category",
          key: "id",
          as:"category_id"
        },
        onDelete: "CASCADE",
      },
      status:{
        type: Sequelize.BOOLEAN ,
        allowNull: false,
        default:0
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
    return queryInterface.dropTable('message_status');
  }
};