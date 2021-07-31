'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('translation_text', [
      { language_id: 1, key_id: 17, text: "کاربر وجود ندارد", created_at: new Date(), updated_at: new Date() },
      { language_id: 2, key_id: 17, text: "User not exist", created_at: new Date(), updated_at: new Date() },
           
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('translation_text', null, {});
  }
};
