'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'user_profile', // table name
        'last_sync_time', // new field name
        {
          type: Sequelize.DATE,
          allowNull:true,
          onDelete: "RESTRICT",
        },
      ),
    ]);
  },

  down(queryInterface, Sequelize) {
    // logic for reverting the changes
    return Promise.all([
      queryInterface.removeColumn('user_profile', 'last_sync_time'),
    ]);
  },
};