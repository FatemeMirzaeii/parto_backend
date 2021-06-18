'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'verification_codes', // table name
        'type', // new field name
        {
          type: Sequelize.STRING,
          allowNull: false,
          default:"login"
        },
      ),
    ]);
  },

  down(queryInterface, Sequelize) {
    // logic for reverting the changes
    return Promise.all([
      queryInterface.removeColumn('verification_codes', 'type'),
    ]);
  },
};