'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('service', [
      { name: '1 گفتگو', type: 'virtual S', price: 100000, created_at: new Date(), updated_at: new Date() },
      { name: 'گفتگو 2', type: 'virtual S', price: 300000, created_at: new Date(), updated_at: new Date() },
      { name: '5 گفتگو', type: 'virtual S', price: 500000, created_at: new Date(), updated_at: new Date() },
      { name: '10 گفتگو', type: 'virtual S', price: 1000000, created_at: new Date(), updated_at: new Date() },
      ], {});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('service', null, {});
  }
};
