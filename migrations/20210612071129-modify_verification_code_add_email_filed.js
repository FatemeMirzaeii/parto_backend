'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'verification_codes', // table name
        'email', // new field name
        {
          type: Sequelize.STRING
        },
      ),
    ]);
  },

  down(queryInterface, Sequelize) {
    // logic for reverting the changes
    return Promise.all([
      queryInterface.removeColumn('verification_codes', 'email'),
    ]);
  },
};