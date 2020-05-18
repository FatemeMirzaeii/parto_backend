'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('translation_text', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      language_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "language",
          key: "id",
        },
        onDelete: "RESTRICT",
      },
      key_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "translation_key",
          key: "id",
        },
        onDelete: "RESTRICT",
      },
      text: {
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
    return queryInterface.dropTable('translation_text');
  }
};