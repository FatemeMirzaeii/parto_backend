'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('discount_per_service', [
      { service_id: 1, status: 'Inactive', discount_type: 'Percent',discount_value:0},
      { service_id: 2, status: 'Active', discount_type: 'Percent',discount_value:10},
      { service_id: 3, status: 'Active', discount_type: 'Percent',discount_value:10},
      { service_id: 4, status: 'Active', discount_type: 'Percent',discount_value:10},
    ], {});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('discount_per_service', null, {});
  }
};
