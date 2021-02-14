'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addConstraint('user_profile', {
        fields: ['user_id'],
        type: 'unique',
        name: 'user_id'

      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addConstraint('user_profile', {
        fields: ['user_id'],
        type: 'unique',
        name: 'user_id'

      })
    ])
  }
};
