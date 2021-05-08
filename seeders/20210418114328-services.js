'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('service', [
      { name: 'Talk to specialist', type: 'virtual S', amount: 5000, created_at: new Date(), updated_at: new Date() },
      { name: 'Analysis', type: 'virtual S', amount: 2000, created_at: new Date(), updated_at: new Date() },
      { name: 'Increase credit 10000', type: 'virtual S', amount: 10000, created_at: new Date(), updated_at: new Date() },
      { name: 'Increase credit 15000', type: 'virtual S', amount: 140000, created_at: new Date(), updated_at: new Date() },
      { name: 'Increase credit 20000', type: 'virtual S', amount: 190000, created_at: new Date(), updated_at: new Date() },
      { name: 'Increase credit 50000', type: 'virtual S', amount: 470000, created_at: new Date(), updated_at: new Date() },
      { name: 'Increase credit 100000', type: 'virtual S', amount: 950000, created_at: new Date(), updated_at: new Date() },
    ], {});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('service', null, {});
  }
};
