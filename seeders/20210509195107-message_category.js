'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('message_category', [
      { name: 'midwife', created_at: new Date(), updated_at: new Date() },
      { name: 'Pharmacist', created_at: new Date(), updated_at: new Date() },
      { name: 'Nutrition', created_at: new Date(), updated_at: new Date() },
     ], {});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('message_category', null, {});
  }
};
