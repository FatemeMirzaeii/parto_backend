'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('translation_text', [
      { language_id: 1, key_id: 1, text: "مقاله مورد نظر یافت نشد.", created_at: new Date(), updated_at: new Date() },
      { language_id: 2, key_id: 1, text: "Article Not Found.", created_at: new Date(), updated_at: new Date() },
      { language_id: 1, key_id: 2, text: "اطلاعات وارد شده صحیح نیست.", created_at: new Date(), updated_at: new Date() },
      { language_id: 2, key_id: 2, text: "Invalid Information", created_at: new Date(), updated_at: new Date() },
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
      { language_id: 1, key_id: 8, text: "اطلاعات شما قبلا ثبت شده است", created_at: new Date(), updated_at: new Date() },
      { language_id: 2, key_id: 8, text: "Information Exists.", created_at: new Date(), updated_at: new Date() },
      { language_id: 1, key_id: 9, text: "شما مجوز دسترسی ندارید.", created_at: new Date(), updated_at: new Date() },
      { language_id: 2, key_id: 9, text: "You don't have permission", created_at: new Date(), updated_at: new Date() },
      { language_id: 1, key_id: 10, text: "مجوز یا شناسه کاربر نامعتبر است", created_at: new Date(), updated_at: new Date() },
      { language_id: 2, key_id: 10, text: "Invalid token or userId", created_at: new Date(), updated_at: new Date() },
      { language_id: 1, key_id: 11, text: "زمان مجاز تمام شده است", created_at: new Date(), updated_at: new Date() },
      { language_id: 2, key_id: 11, text: "Time over", created_at: new Date(), updated_at: new Date() },
      { language_id: 1, key_id: 12, text: " شناسه نامعتبراست", created_at: new Date(), updated_at: new Date() },
      { language_id: 2, key_id: 12, text: "Invalid id", created_at: new Date(), updated_at: new Date() },
      { language_id: 1, key_id: 13, text: "مشکلی سمت سرور رخ داد لطفا دوباره امتحان کنید", created_at: new Date(), updated_at: new Date() },
      { language_id: 2, key_id: 13, text: "Server error occurred. Please try again", created_at: new Date(), updated_at: new Date() },
      { language_id: 1, key_id: 14, text: "اطلاعاتی یافت نشد", created_at: new Date(), updated_at: new Date() },
      { language_id: 2, key_id: 14, text: "Information Not Found ", created_at: new Date(), updated_at: new Date() },
      { language_id: 1, key_id: 15, text: "تاریخ وارد شده نادرست است", created_at: new Date(), updated_at: new Date() },
      { language_id: 2, key_id: 15, text: " Invalid Date", created_at: new Date(), updated_at: new Date() },
      { language_id: 1, key_id: 16, text: "بین اطلاعات وارد شده و اطلاعات موجود تناقض وجود دارد", created_at: new Date(), updated_at: new Date() },
      { language_id: 2, key_id: 16, text: "Discrepancy between the information entered and available", created_at: new Date(), updated_at: new Date() },
      { language_id: 1, key_id: 17, text: "کاربر پیدا نشد", created_at: new Date(), updated_at: new Date() },
      { language_id: 2, key_id: 17, text: "User not exist", created_at: new Date(), updated_at: new Date() },
      { language_id: 1, key_id: 18, text: "اطلاعات همسر شما یافت نشد", created_at: new Date(), updated_at: new Date() },
      { language_id: 2, key_id: 18, text: "partner information not found", created_at: new Date(), updated_at: new Date() },
      
     
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('translation_text', null, {});
  }
};
