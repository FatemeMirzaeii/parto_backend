'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('pregnancy', {
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
      pregnancy_week: {
        type: Sequelize.INTEGER
      },
      due_date: {
        type: Sequelize.DATEONLY ,
        get: function() {
          return moment.utc(this.getDataValue('due_date')).format('YYYY-MM-DD');
        }
      },
      conception_date:{
        type: Sequelize.DATEONLY ,
        get: function() {
          return moment.utc(this.getDataValue('zygosis_date')).format('YYYY-MM-DD');
        }
      },
      abortion: {
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
    return queryInterface.dropTable('pregnancy');
  }
};