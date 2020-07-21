'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('translation_key', [
      { key: 'ARTICLENOTFOUND', created_at: new Date(), updated_at: new Date() },
      { key: 'INVALIDENTRY', created_at: new Date(), updated_at: new Date() },
      { key: 'WRONGPASSWORD', created_at: new Date(), updated_at: new Date() },
      { key: 'CATEGORYEXISTS', created_at: new Date(), updated_at: new Date() },
      { key: 'NOSUCHCATEGORY', created_at: new Date(), updated_at: new Date() },
      { key: 'SUCCESSFUL', created_at: new Date(), updated_at: new Date() },
      { key: 'NONOTES', created_at: new Date(), updated_at: new Date() },
      { key: 'EMAILEXISTS', created_at: new Date(), updated_at: new Date() },
      { key: 'NOPERMISSION', created_at: new Date(), updated_at: new Date() },
      { key: 'INVALIDTOKEN', created_at: new Date(), updated_at: new Date() },
      { key: 'TIMEOVER', created_at: new Date(), updated_at: new Date() },
      { key: 'INVALIDID', created_at: new Date(), updated_at: new Date() },
      { key: 'SERVERERROR', created_at: new Date(), updated_at: new Date() },
    ], {});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('translation_key', null, {});
  }
};
