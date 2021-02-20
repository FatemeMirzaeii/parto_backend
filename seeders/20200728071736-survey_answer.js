'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('survey_answers', [
      { question: 'کارکردن با پرتو برام راحته',weakness:0, createdAt: new Date(), updatedAt: new Date() },
      { question: ' از پس تشخیص روزهای مهم دوره هام برمیاد',weakness:0, createdAt: new Date(), updatedAt: new Date() },
      { question: 'ظاهر پرتو جذاب و دوست داشتنیه',weakness:0, createdAt: new Date(), updatedAt: new Date() },
      { question: 'امکانات متنوع و خوبی داره',weakness:0, createdAt: new Date(), updatedAt: new Date() },
      { question: 'برنامه اختلال داره و گاهی هنگ می کنه',weakness:1, createdAt: new Date(), updatedAt: new Date() },
      { question: 'محاسبات پرتو اشتباهه',weakness:1, createdAt: new Date(), updatedAt: new Date() },
      { question: 'کارکردن با پرتو برام سخته',weakness:1, createdAt: new Date(), updatedAt: new Date() },
      { question: 'طراحی برنامه قشنگ نیست',weakness:1, createdAt: new Date(), updatedAt: new Date() },
      
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('survey_answers', null, {});
  }
};
