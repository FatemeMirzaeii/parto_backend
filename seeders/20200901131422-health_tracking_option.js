'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('health_tracking_option', [
      { title: 'سبک',category_id:1,	icon:"<svg>", created_at: new Date(), updated_at: new Date() },
      { title: 'سنگین',category_id:1,	icon:"<svg>", created_at: new Date(), updated_at: new Date() },
      
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('health_tracking_option', null, {});
  }
};
