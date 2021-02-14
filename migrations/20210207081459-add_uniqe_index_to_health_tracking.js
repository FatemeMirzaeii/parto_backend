'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addIndex('user_tracking_option', ['user_id', 'tracking_option_id', 'date'], { unique: true })
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([queryInterface.addIndex('user_tracking_option', ['user_id', 'tracking_option_id', 'date'])]);
  }
};
