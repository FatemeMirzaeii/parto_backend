'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('health_tracking_category', [
      { title: 'خونریزی',has_multiple_choice:0	,color:"#11111" ,	icon:"<svg>", created_at: new Date(), updated_at: new Date() },
      { title: 'خونریزی',has_multiple_choice:0	,color:"#11111" ,	icon:"<svg>", created_at: new Date(), updated_at: new Date()},
      { title: 'خونریزی',has_multiple_choice:0	,color:"#11111" ,	icon:"<svg>", created_at: new Date(), updated_at: new Date() },
      
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('health_tracking_category', null, {});
  }
};
