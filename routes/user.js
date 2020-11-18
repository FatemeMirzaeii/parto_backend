const express = require("express");
const { user } = require("../models");
const bcrypt = require("bcrypt");
const router = express.Router();
const translate = require("../config/translate");
const auth = require("../middleware/auth");

router.post("/signUp/:lang", async (req, res) => {
  if (req.body.phone == "") {
    return res
      .status(400)
      .json({ message: await translate("INVALIDENTRY", req.params.lang) });
  }
  let existsPhone;
  let existsEmail;

  if (req.body.phone != "") {
    const regex = RegExp(/^(\+98|0098|98|0)?9\d{9}$/g);
    let check = regex.test(req.body.phone);

    if (!check)
      return res
        .status(400)
        .json({ message: await translate("INVALIDENTRY", "fa") });

    existsPhone = await user.findOne({
      where: {
        phone: req.body.phone,
      },
    });
  }
  // else{
  //   existsEmail = await user.findOne({
  //     where: {
  //       email: req.body.email,
  //     },
  //   });
  // }
  // console.log("existsEmail",existsEmail,"existsPhone",existsPhone);
  // console.log(existsPhone!=null || existsEmail!=null);
  if (existsPhone != null)
    return res
      .status(409)
      .json({ message: await translate("EXISTS", req.params.lang) });

  let usr;
  if (req.body.imei != "") {
    const regex = RegExp(/^\d{15}$/g);
    let check = regex.test(req.body.imei);
    if (!check)
      return res
        .status(400)
        .json({ message: await translate("INVALIDENTRY", req.params.lang) });

    //const hash = await bcrypt.hash(req.body.password, 10);
    usr = await user.create({
      name: req.body.name,
      phone: req.body.phone,
      //email: req.body.email,
      //password: hash,
      imei: req.body.imei,
    });
  } else {
    usr = await user.create({
      name: req.body.name,
      phone: req.body.phone,
    });
  }
  await usr.createUser_log({
    i_p: req.header("x-forwarded-for"),
    version: req.body.version,
    login_date: Date.now(),
  });
  const token = await usr.generateAuthToken();
  return res
    .header("x-auth-token", token)
    .status(200)
    .json({ data: { id: usr.id } });
});

router.post("/linkForgetPassword/:lang", async (req, res) => {
  let usr;
  if (req.body.phone == "") {
    if (!usr)
      return res
        .status(400)
        .json({ message: await translate("INVALIDENTRY", req.params.lang) });
  }
  if (req.body.phone != "") {
    usr = await user.findOne({
      where: {
        phone: req.body.phone,
      },
    });
    if (usr == null)
      return res
        .status(400)
        .json({ message: await translate("INVALIDENTRY", req.params.lang) });

    await usr.update({ uuid: uuid() });

    await usr.createUser_log({
      i_p: req.header("x-forwarded-for"),
      version: req.body.version,
      login_date: Date.now(),
    });

    let api = Kavenegar.KavenegarApi({
      apikey:
        "6D58546F68663949326476336B636A354F39542B474B47456D564A68504361377154414D78446D637263383D",
    });
    api.VerifyLookup(
      {
        receptor: req.body.phone,
        token: usr.uuid,
        token2: req.params.lang,
        template: "forgetPassword",
      },
      async (response, status, message) => {
        if (status == 418) {
          sendEmail(
            "info@partobanoo.com",
            "parto@partobanoo.com",
            message,
            "ارور سامانه پیامکی "
          );
        }
        return res.status(status).json({ message: message });
      }
    );
  }
  // else{
  //   usr = await user.findOne({
  //     where: {
  //       email: req.body.email,
  //     },
  //   });
  //   if (usr==null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });

  //   await usr.update({ uuid: uuid()});

  //   await usr.createUser_log({
  //     i_p: req.header("x-forwarded-for"),
  //     version: req.body.version,
  //     login_date: Date.now(),
  //   });
  //   const subject='Forget password for use parto application';
  //   const text='please click on the linke https://api.partobanoo.com/auth/forgetPassword/'+ usr.uuid+'/'+req.params.lang;
  //   const result=sendEmail('parto@partobanoo.com',req.body.email,text,subject);
  //   if(result=="ERROR") return res.status(502).json({message: await translate("SERVERERROR", "fa")});
  //   else return res.status(200).json({data:{ message: await translate("SUCCESSFUL", req.params.lang) },link:text });
  // }
});

router.post("/setNewPassword/:lang", async (req, res) => {
  const usr = await user.findOne({
    where: {
      uuid: req.body.uuid,
    },
  });
  if (!usr)
    return res
      .status(400)
      .json({ message: await translate("INVALIDID", req.params.lang) });

  if (Math.abs(new Date().getTime() - usr.updatedAt) > 900000)
    return res
      .status(400)
      .json({ message: await translate("INVALIDENTRY", req.params.lang) });

  await usr.update({ password: await bcrypt.hash(req.body.newPassword, 10) });
  await usr.createUser_log({
    i_p: req.header("x-forwarded-for"),
    version: req.body.version,
    login_date: Date.now(),
  });
  return res
    .status(200)
    .json({ message: await translate("SUCCESSFUL", req.params.lang) });
});

router.post("/changePassword/:lang", async (req, res) => {
  let usr;
  if (req.body.phone == "" && req.body.email == "") {
    if (!usr)
      return res
        .status(400)
        .json({ message: await translate("INVALIDENTRY", req.params.lang) });
  }
  if (req.body.phone != "") {
    usr = await user.findOne({
      where: {
        phone: req.body.phone,
      },
    });
  } else {
    usr = await user.findOne({
      where: {
        email: req.body.email,
      },
    });
  }

  if (usr == null)
    return res
      .status(400)
      .json({ message: await translate("INVALIDENTRY", req.params.lang) });

  const pass = await bcrypt.compare(req.body.password, usr.password);

  if (!pass || req.body.newPassword == "")
    return res
      .status(400)
      .json({ message: await translate("INVALIDENTRY", req.params.lang) });

  await usr.update({ password: await bcrypt.hash(req.body.newPassword, 10) });

  await usr.createUser_log({
    i_p: req.header("x-forwarded-for"),
    version: req.body.version,
    login_date: Date.now(),
  });
  return res
    .status(200)
    .json({ message: await translate("SUCCESSFUL", req.params.lang) });
});

router.post("/versionType/:userId/:type/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null || req.params.type == "" || req.params.type == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  if(usr.version_type!="Teenager") return res.status(400).json({ message: await translate("NOPERMISSION", req.params.lang) });
  if (req.params.type != "" && req.params.type != null) {
    if (req.params.type != "Main") {
      return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
    }
  }
  await usr.update({ version_type: req.params.type });
  return res
    .status(200)
    .json({ message: await translate("SUCCESSFUL", req.params.lang) });
})

module.exports = router;
