const { uuid } =require ('uuid');
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

router.post("/emailForgetPassword/:lang",async(req,res)=>{
  const usr = await user.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (!usr) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  const uuid=uuid()
  await usr.update({ uuid: uuid , forgetPasswordDate:Date.now() });

  await usr.createUser_log({
    i_p: req.header("x-forwarded-for"),
    version: req.body.version,
    login_date: Date.now(),
  });
  const subject='Forget password for use parto application';
  const text='please click on the linke https://api.partobanoo.com/auth/forgetPassword/:'+ uuid+':/'+lang;
  const result=sendEmail('info@partobanoo.com',req.body.email,text,subject);
  if(result=="ERROR") return res.status(502).json({message: await translate("SERVERERROR", "fa")});
  else return res.status(200).json({ message: await translate("SUCCESSFUL", req.params.lang) });
})

router.post("/forgotPassword/:lang", async(req, res) => {
  const usr = await user.findOne({
    where: {
      uuid: uuid,
    },
  });
  if(!usr) return res.status(400).json({ message: await translate("INVALIDID", req.params.lang) });
  
  let time=dates.compare(Date.now(),usr.updated_at);//compare to time with each other +15 min
  if(time>1)  return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
    
  await usr.update({ password: req.body.newPassword });
  await usr.createUser_log({
    i_p: req.header("x-forwarded-for"),
    version: req.body.version,
    login_date: Date.now(),
  });
  return res.status(200).json({ message: await translate("SUCCESSFUL", req.params.lang) });
  
});

router.post("/changePassword:lang", async(req, res) => {
  const usr = await user.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (!usr) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
 
  const pass = await bcrypt.compare(req.body.password, usr.password);
  if (!pass) return res.status(400).json({ message: await translate("WRONGPASSWORD", req.params.lang) });
  
  await usr.update({ password: req.body.newPassword });

  await usr.createUser_log({
    i_p: req.header("x-forwarded-for"),
    version: req.body.version,
    login_date: Date.now(),
  });
  res.status(200).json({ message: await translate("SUCCESSFUL", req.params.lang) });
});

router.post("/sendVerificationCode", async(req, res) => {
  const code= Math.floor(Math.random() * (99999 - 10000 + 1) + 10000);

  const subject='Verification Code for parto application ';
  let text = 'می باشد'+code +' کد فعالسازی شما '
  const result=sendEmail(PartoEmail,Pass,req.body.email,subject,text);
  if(result=="ERROR") return res.status(501);
  else return res.status(200).json({ message: await translate("SUCCESSFUL", req.params.lang) })
    
});
module.exports = router;
