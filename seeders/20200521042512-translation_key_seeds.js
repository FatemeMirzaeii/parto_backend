'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('translation_key', [
      { key: 'ARTICLENOTFOUND', created_at: new Date(), updated_at: new Date() },//404
      { key: 'INVALIDENTRY', created_at: new Date(), updated_at: new Date() },//400
      { key: 'WRONGPASSWORD', created_at: new Date(), updated_at: new Date() },//400
      { key: 'CATEGORYEXISTS', created_at: new Date(), updated_at: new Date() },//409
      { key: 'NOSUCHCATEGORY', created_at: new Date(), updated_at: new Date() },//404
      { key: 'SUCCESSFUL', created_at: new Date(), updated_at: new Date() },//200
      { key: 'NONOTES', created_at: new Date(), updated_at: new Date() },//404
      { key: 'EXISTS', created_at: new Date(), updated_at: new Date() },//409
      { key: 'NOPERMISSION', created_at: new Date(), updated_at: new Date() },//401
      { key: 'INVALIDTOKEN', created_at: new Date(), updated_at: new Date() },//400
      { key: 'TIMEOVER', created_at: new Date(), updated_at: new Date() },//408
      { key: 'INVALIDID', created_at: new Date(), updated_at: new Date() },//400
      { key: 'SERVERERROR', created_at: new Date(), updated_at: new Date() },//500
      { key: 'INFORMATIONNOTFOUND', created_at: new Date(), updated_at: new Date() },//404
      { key: 'INVALIDDATE', created_at: new Date(), updated_at: new Date() },//400
      
    ], {});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('translation_key', null, {});
  }
};
