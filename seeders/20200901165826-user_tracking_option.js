'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('user_tracking_option', [
      {user_id:1,	tracking_option_id:2,	date:"2020-05-05", created_at: new Date(), updated_at: new Date() },
      {user_id:1,	tracking_option_id:2,	date:"2020-05-05", created_at: new Date(), updated_at: new Date() },
      
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('user_tracking_option', null, {});
  }
};
