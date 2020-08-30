'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('survey_answers', [
      { answer: 'کارکردن با پرتو برام راحته', createdAt: new Date(), updatedAt: new Date() },
      { answer: ' از پس تشخیص روزهای مهم دوره هام برمیاد', createdAt: new Date(), updatedAt: new Date() },
      { answer: 'ظاهر پرتو جذاب و دوست داشتنیه', createdAt: new Date(), updatedAt: new Date() },
      { answer: 'امکانات متنوع و خوبی داره', createdAt: new Date(), updatedAt: new Date() },
      { answer: 'برنامه اختلال داره و گاهی هنگ می کنه', createdAt: new Date(), updatedAt: new Date() },
      { answer: 'باوجود وارد کردن اطلاعاتم بازهم محاسبات پرتو اشتباهه', createdAt: new Date(), updatedAt: new Date() },
      { answer: 'کارکردن با پرتو برام سخته', createdAt: new Date(), updatedAt: new Date() },
      { answer: 'طراحی برنامه قشنگ نیست', createdAt: new Date(), updatedAt: new Date() },
      
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('survey_answers', null, {});
  }
};
