'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('message_category', [
      { name: 'دستیار مامایی', created_at: new Date(), updated_at: new Date() },
      { name: 'دستیار تغذیه', created_at: new Date(), updated_at: new Date() },
      { name: 'دستیار احکام', created_at: new Date(), updated_at: new Date() },
     ], {});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('message_category', null, {});
  }
};
