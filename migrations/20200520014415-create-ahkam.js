'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ahkam', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      marja_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "marja",
          key: "id",
        },
        onDelete: "RESTRICT",
      },
      article_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "article",
          key: "id",
        },
        onDelete: "RESTRICT",
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
    return queryInterface.dropTable('ahkam');
  }
};
