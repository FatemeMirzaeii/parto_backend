'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('service', [
      { name: 'صحبت با مشاور', type: 'virtual S', amount: 100000, created_at: new Date(), updated_at: new Date() },
      { name: 'افزایش اعتبار به  ارزش 10000 ریال', type: 'virtual S', amount: 10000, created_at: new Date(), updated_at: new Date() },
      { name: 'افزایش اعتبار به  ارزش 100000 ریال', type: 'virtual S', amount: 100000, created_at: new Date(), updated_at: new Date() },
      { name: 'افزایش اعتبار به  ارزش 200000 ریال', type: 'virtual S', amount: 200000, created_at: new Date(), updated_at: new Date() },
      { name: 'افزایش اعتبار به  ارزش 500000 ریال', type: 'virtual S', amount: 500000, created_at: new Date(), updated_at: new Date() },
      { name: 'افزایش اعتبار به  ارزش 1000000 ریال', type: 'virtual S', amount: 1000000, created_at: new Date(), updated_at: new Date() },
    ], {});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('service', null, {});
  }
};
