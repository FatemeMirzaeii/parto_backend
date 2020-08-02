
const express = require("express");
const { user } = require("../models");
const bcrypt = require("bcrypt");
const router = express.Router();
const translate = require("../config/translate");
const sendEmail=require("../middleware/sendEmail");

router.post("/signIn/:lang", async (req, res) => {
  const usr = await user.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (!usr) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  const pass = await bcrypt.compare(req.body.password, usr.password);
  if (!pass) return res.status(400).json({ message: await translate("WRONGPASSWORD", req.params.lang) });
  const token = usr.generateAuthToken();
  await usr.createUser_log({
    i_p: req.header("x-forwarded-for"),
    version: req.body.version,
    login_date: Date.now(),
  });
  res.header("x-auth-token", token).status(200).json({ data: { id: usr.id } });
});

router.post("/sendVerificationCode", async(req, res) => {
  const usr = await user.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (!usr) return res.status(400).json({ message: await translate("INVALIDENTRY", "fa") });
 
  const code= Math.floor(Math.random() * (99999 - 10000 + 1) + 10000);

  const subject='Verification Code for parto application ';
  let text =`کد فعالسازی شما : ${code}  `;
  const result=sendEmail('parto@partobanoo.com',req.body.email,text,subject);
  if(result=="ERROR") return res.status(502).json({message: await translate("SERVERERROR", "fa")});
  else return res.status(200).json({ message: await translate("SUCCESSFUL", "fa") })
    
});
module.exports = router;
