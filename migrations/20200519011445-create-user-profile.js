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
        allowNull: true,
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
      locked: {
        type: Sequelize.BOOLEAN
      },
      period_prediction: {
        type: Sequelize.BOOLEAN
      },
      ovulation_prediction: {
        type: Sequelize.BOOLEAN
      },
      red_days: {
        type: Sequelize.BOOLEAN
      },
      last_period_date:{
        type: Sequelize.DATEONLY,
        allowNull: true,
        // get: function() {
        //   return moment.utc(this.getDataValue('last_period_date')).format('YYYY-MM-DD');
        // }
      } ,
      blood_type:{
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
    return queryInterface.dropTable('user_profile');
  }
};