'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('language', [
      { name: 'fa', created_at: new Date(), updated_at: new Date() },
      { name: 'en', created_at: new Date(), updated_at: new Date() },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('language', null, {});
  }
};
