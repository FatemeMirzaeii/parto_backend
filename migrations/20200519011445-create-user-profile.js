'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('user_profile', {
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
        onDelete: "RESTRICT",
      },
      birthdate: {
        type: Sequelize.DATEONLY ,
        get: function() {
          return moment.utc(this.getDataValue('birthdate')).format('YYYY-MM-DD');
        }
      },
      avg_cycle_length: {
        type: Sequelize.INTEGER
      },
      avg_period_length: {
        type: Sequelize.INTEGER
      },
      avg_sleeping_hour: {
        type: Sequelize.INTEGER
      },
      pms_length: {
        type: Sequelize.INTEGER
      },
      height: {
        type: Sequelize.INTEGER
      },
      weight: {
        type: Sequelize.INTEGER
      },
      pregnant: {
        type: Sequelize.BOOLEAN
      },
      pregnancy_try: {
        type: Sequelize.BOOLEAN
      },
      use_lock: {
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
    return queryInterface.dropTable('user_profile');
  }
};