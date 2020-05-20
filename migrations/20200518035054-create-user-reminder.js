'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('user_reminder', {
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
        },
        onDelete: "RESTRICT",
      },
      title: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.ENUM(
          "روزانه",
          "هفتگی",
          "ماهانه",
        )
      },
      hour: {
        type: Sequelize.TIME
      },
      weekday: {
        type: Sequelize.ENUM(
          "شنبه",
          "یکشنبه",
          "دوشنبه",
          "سه شنبه",
          "چهارشنبه",
          "پنجشنبه",
          "جمعه"
        )
      },
      day_in_month: {
        type: Sequelize.INTEGER
      },
      active: {
        type: Sequelize.BOOLEAN
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
    return queryInterface.dropTable('user_reminder');
  }
};