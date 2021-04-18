'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('service', [
      { service: 'Increase credit', created_at: new Date(), updated_at: new Date() },
      { service: 'Talk to specialist', created_at: new Date(), updated_at: new Date() },
      { service: 'Analysis', created_at: new Date(), updated_at: new Date() },
    ], {});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('service', null, {});
  }
};
