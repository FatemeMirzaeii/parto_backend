'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('service', [
      { name: 'بسته تکی گفتگو', type: 'virtual S', amount: 100000, created_at: new Date(), updated_at: new Date() },
      { name: 'بسته سه تایی گقتگو', type: 'virtual S', amount: 300000, created_at: new Date(), updated_at: new Date() },
      { name: 'بسته 5 تایی گفنگو', type: 'virtual S', amount: 500000, created_at: new Date(), updated_at: new Date() },
      { name: 'بسته 10 تایی گفتگو', type: 'virtual S', amount: 1000000, created_at: new Date(), updated_at: new Date() },
    ], {});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('service', null, {});
  }
};
