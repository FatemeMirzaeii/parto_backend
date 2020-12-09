'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'pregnancy', // table name
        'state', // new field name
        {
          type: Sequelize.ENUM('1','2','3'),// 1= active data 2=deleted data 3= arcived data 
          allowNull: false,
          defaultValue: 1,
        },
      ),
    ]);
  },

  down(queryInterface, Sequelize) {
    // logic for reverting the changes
    return Promise.all([
      queryInterface.removeColumn('pregnancy', 'state'),
    ]);
  },
};