'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('translation_key', [
      { key: 'UERENOTFOUND', created_at: new Date(), updated_at: new Date() },//404
      { key: 'INVALIDCODE', created_at: new Date(), updated_at: new Date() },//400
    ], {});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('translation_key', null, {});
  }
};
