'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Period', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      start_date: {
        type: Sequelize.DATEONLY ,
        get: function() {
          return moment.utc(this.getDataValue('start_date')).format('YYYY-MM-DD');
        }
      },
      end_date: {
        type: Sequelize.DATEONLY ,
        get: function() {
          return moment.utc(this.getDataValue('end_date')).format('YYYY-MM-DD');
        }
      },
      time: {
        type: Sequelize.DATE
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: "user",
          key: "id",
        },
        onDelete: "RESTRICT",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Period');
  }
};