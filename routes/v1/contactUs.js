const express = require("express");
const router = express.Router();
const translate = require("../../config/translate");
const creds = require("../../config/email");
const sEmail = require("../../middleware/sendEmail");
const logger = require("../../config/logger/logger");


router.post("/email/:lang", async (req, res) => {
  let name = req.body.name;
  let email = req.body.email;
  let message = req.body.message;
  let title = req.body.title;
  let content = `نام کاربر: ${name} \n ایمیل: ${email}\n عنوان: ${title} \n متن پیام: ${message} `;
  let subject = "ایمیل ارسال شده از طرف کاربر با عنوان:" + req.body.title;
  let result;
  result = await sEmail(creds.USER, "info@parto.email", content, subject);
  console.log(result);
  if (result == 500) {
    logger.error("SEND EMAIL FAILED-"+ result);
    return res
      .status(502)
      .json({
        status: "error",
        data: null,
        message: await translate("SERVERERROR", req.params.lang)
      });
  } else {
    return res
      .status(200)
      .json({
        status: "success",
        data: null,
        message: await translate("SUCCESSFUL", req.params.lang)
      });
  }
});

module.exports = router;
