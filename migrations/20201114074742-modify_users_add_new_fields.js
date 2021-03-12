'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'User', // table name
        'partner_id', // new field name
        {
          type: Sequelize.INTEGER,
          allowNull:true,
          references: {
            model: "user",
            key: "id",
          },
          onDelete: "RESTRICT",
        },
      ),
    ]);
  },

  down(queryInterface, Sequelize) {
    // logic for reverting the changes
    return Promise.all([
      queryInterface.removeColumn('User', 'partner_id'),
    ]);
  },
};