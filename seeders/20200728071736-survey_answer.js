'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('survey_answers', [
      { answer: 'question1', createdAt: new Date(), updatedAt: new Date() },
      { answer: 'question2', createdAt: new Date(), updatedAt: new Date() },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('survey_answers', null, {});
  }
};
