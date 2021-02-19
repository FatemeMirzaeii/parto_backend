const express = require("express");
const router = express.Router();
const translate = require("../config/translate");
const creds = require("../config/email");
const sEmail = require("../middleware/sendEmail");


router.post("/email", async (req, res) => {
  let name = req.body.name;
  let email = req.body.email;
  let message = req.body.message;
  let title = req.body.title;
  let content = `نام کاربر: ${name} \n ایمیل: ${email}\n عنوان: ${title} \n متن پیام: ${message} `;
  let subject = "ایمیل ارسال شده از طرف کاربر با عنوان:" + req.body.title;
  let result ;
  result = await sEmail(creds.USER, "info@parto.email", content, subject);
  console.log(result);
  if (result == "ERROR")
    return res
      .status(502)
      .json({ message: await translate("SERVERERROR", "fa") });
  else
    return res
      .status(200)
      .json({ message: await translate("SUCCESSFUL", "fa") });
});

module.exports = router;
