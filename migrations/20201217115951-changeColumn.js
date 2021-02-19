'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn(
        'User', // table name
        'version_type', // new field name
        {
          type: Sequelize.ENUM('Main', 'Partner', 'Teenager'),
          allowNull: true,
          defaultValue: null,
        },
      ),
    ]);
  },

  down(queryInterface, Sequelize) {
    // logic for reverting the changes
    return Promise.all([
      queryInterface.removeColumn('User', 'version_type'),
    ]);
  },
};