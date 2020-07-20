'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('translation_text', [
      { language_id: 1, key_id: 1, text: "مقاله مورد نظر یافت نشد.", created_at: new Date(), updated_at: new Date() },
      { language_id: 2, key_id: 1, text: "Article Not Found.", created_at: new Date(), updated_at: new Date() },
      { language_id: 1, key_id: 2, text: "اطلاعات وارد شده صحیح نیست.", created_at: new Date(), updated_at: new Date() },
      { language_id: 2, key_id: 2, text: "Invalid Email or Password", created_at: new Date(), updated_at: new Date() },
      { language_id: 1, key_id: 3, text: "رمز نامعتبر", created_at: new Date(), updated_at: new Date() },
      { language_id: 2, key_id: 3, text: "Wrong Password", created_at: new Date(), updated_at: new Date() },
      { language_id: 1, key_id: 4, text: "این دسته از قبل موجود است.", created_at: new Date(), updated_at: new Date() },
      { language_id: 2, key_id: 4, text: "Category Exists.", created_at: new Date(), updated_at: new Date() },
      { language_id: 1, key_id: 5, text: "چنین دسته ای موجود نیست", created_at: new Date(), updated_at: new Date() },
      { language_id: 2, key_id: 5, text: "Category doesn't exist.", created_at: new Date(), updated_at: new Date() },
      { language_id: 1, key_id: 6, text: "با موفقیت انجام شد.", created_at: new Date(), updated_at: new Date() },
      { language_id: 2, key_id: 6, text: "Successful", created_at: new Date(), updated_at: new Date() },
      { language_id: 1, key_id: 7, text: "برای امروز چیزی ثبت نکرده بودی :)", created_at: new Date(), updated_at: new Date() },
      { language_id: 2, key_id: 7, text: "You don'thave any note for today", created_at: new Date(), updated_at: new Date() },
      { language_id: 1, key_id: 8, text: "شما قبلا ثبت نام کرده اید.", created_at: new Date(), updated_at: new Date() },
      { language_id: 2, key_id: 8, text: "Email Exists.", created_at: new Date(), updated_at: new Date() },
      { language_id: 1, key_id: 9, text: "شما مجوز دسترسی ندارید.", created_at: new Date(), updated_at: new Date() },
      { language_id: 2, key_id: 9, text: "You don't have permission", created_at: new Date(), updated_at: new Date() },
      { language_id: 1, key_id: 10, text: "مجوز نامعتبر", created_at: new Date(), updated_at: new Date() },
      { language_id: 2, key_id: 10, text: "Invalid token", created_at: new Date(), updated_at: new Date() },
      { language_id: 1, key_id: 11, text: "زمان مجاز تمام شده است", created_at: new Date(), updated_at: new Date() },
      { language_id: 2, key_id: 11, text: "Time over", created_at: new Date(), updated_at: new Date() },
      { language_id: 1, key_id: 12, text: "اطلاعات نامعتبر", created_at: new Date(), updated_at: new Date() },
      { language_id: 2, key_id: 12, text: "Invalid id", created_at: new Date(), updated_at: new Date() },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('translation_text', null, {});
  }
};
