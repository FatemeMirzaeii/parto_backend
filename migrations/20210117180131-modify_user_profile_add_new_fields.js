'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'user_profile', // table name
        'image', // new field name
        {
          type: Sequelize.STRING,
          allowNull:true,
          onDelete: "RESTRICT",
        },
      ),
    ]);
  },

  down(queryInterface, Sequelize) {
    // logic for reverting the changes
    return Promise.all([
      queryInterface.removeColumn('user_profile', 'image'),
    ]);
  },
};