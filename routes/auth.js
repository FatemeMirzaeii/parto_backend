
const express = require("express");
const { user, verification_code } = require("../models");
const router = express.Router();
const translate = require("../config/translate");
const sendEmail = require("../middleware/sendEmail");
const auth = require("../middleware/auth");
const Kavenegar = require('kavenegar');
const useragent = require('useragent');

router.post("/signIn/:lang", async (req, res) => {
  let usr;
  if (req.body.phone == "") {
    return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  }
  if (req.body.phone != "") {
    const regex = RegExp(/^(\+98|0098|98|0)?9\d{9}$/g);
    let check = regex.test(req.body.phone);

    if (!check) return res.status(400).json({ message: await translate("INVALIDENTRY", "fa") });

    usr = await user.findOne({
      where: {
        phone: req.body.phone,
      },
    });
  }
  // else{
  //   usr = await user.findOne({
  //     where: {
  //       email: req.body.email,
  //     },
  //   });
  // }
  if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  // const pass = await bcrypt.compare(req.body.password, usr.password);
  // if (!pass) return res.status(400).json({ message: await translate("WRONGPASSWORD", req.params.lang) });
  const token = await usr.generateAuthToken();
  console.log("token", token);
  await usr.createUser_log({
    i_p: req.header("x-forwarded-for"),
    version: req.body.version,
    login_date: Date.now(),
  });
  res.header("x-auth-token", token).status(200).json({ data: { id: usr.id, userName: usr.name } });
});

router.post("/logIn/:lang", async (req, res) => {
  const patt1 = RegExp('127.0.0.1*');
  const patt2 = RegExp('localhost*');
  let usr;
  console.log("phone", req.body.phone)
  if (req.body.phone == "" || req.body.phone == null) {
    return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  }
  if (req.body.phone != "") {
    const regex = RegExp(/^(\+98|0098|98|0)?9\d{9}$/g);
    let check = regex.test(req.body.phone);
    console.log("check", check)
    if (!check) return res.status(400).json({ message: await translate("INVALIDENTRY", "fa") });

    usr = await user.findOne({
      where: {
        phone: req.body.phone,
      },
    });
  }
  // else{
  //   usr = await user.findOne({
  //     where: {
  //       email: req.body.email,
  //     },
  //   });
  // }

  if (req.body.type != "" && req.body.type != null) {
    if (req.body.type != "Main" && req.body.type != "Partner" && req.body.type != "Teenager") {
      return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
    }
  }
  if (usr == null) {

    if (req.body.imei != null && req.body.imei != "") {
      const regex = RegExp(/^\d{15}$/g);
      let check = regex.test(req.body.imei);
      if (!check) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });

      usr = await user.create({
        name: req.body.name,
        phone: req.body.phone,
        version_type: req.body.type,
        //email: req.body.email,
        //password: hash,
        imei: req.body.imei
      });
    }
    else {
      usr = await user.create({
        name: req.body.name,
        phone: req.body.phone,
        version_type: req.body.type
      });
    }
  }
  const token = await usr.generateAuthToken();
  console.log("token", token);
  await usr.createUser_log({
    i_p: req.header("x-forwarded-for"),
    version: req.body.version,
    login_date: Date.now(),
  });
  console.log("req.headers['user-agent']", req.headers['user-agent']);
  console.log(
    useragent.is(req.headers['user-agent']).firefox == false,
    useragent.is(req.headers['user-agent']).chrome == false,
    useragent.is(req.headers['user-agent']).ie == false,
    useragent.is(req.headers['user-agent']).mozilla == false,
    useragent.is(req.headers['user-agent']).opera == false)
  if (RegExp('http://localhost:3925').test(req.headers['origin']) == true) {
    return res.status(200).json({ data: { id: usr.id, token: token, userName: usr.name, type: usr.version_type } });
  }
  else if (useragent.is(req.headers['user-agent']).firefox == false &&
    useragent.is(req.headers['user-agent']).chrome == false &&
    useragent.is(req.headers['user-agent']).ie == false &&
    useragent.is(req.headers['user-agent']).mozilla == false &&
    useragent.is(req.headers['user-agent']).opera == false && useragent.is(req.headers['user-agent']).safari==false||
    patt1.test(req.headers.host) == true || patt2.test(req.headers.host) == true) {
    console.log("set headersssss");
    return res.header("x-auth-token", token).status(200).json({ data: { id: usr.id, userName: usr.name, type: usr.version_type } });

  }
  else {
    console.log("set cookiessssssssss");
    res.clearCookie('token');
    return res
      .cookie("token", await token, { httpOnly: true, expires: false, secure: true, maxAge: 10 * 365 * 24 * 60 * 60 * 1000 })
      .status(200)
      .json({ data: { id: usr.id, userName: usr.name, type: usr.version_type } });
  }
})

router.post("/verificationCode", async (req, res) => {
  let code = Math.floor(Math.random() * (99999 - 10000 + 1) + 10000);
  if (req.body.phone != "") {
    const regex = RegExp(/^(\+98|0098|98|0)?9\d{9}$/g);
    let check = regex.test(req.body.phone);

    if (!check) return res.status(400).json({ message: await translate("INVALIDENTRY", "fa") });
    else {
      let userExist = await verification_code.findOne({
        where: {
          phone: req.body.phone,
        }
      });
      if (userExist != null) {

        if (new Date() - new Date(userExist.createdAt) < (2 * 60 * 1000)) {
          return res.status(409).json({ data: { message: await translate("EXISTS", "fa") } }).end();
        }
        else {
          await verification_code.destroy({
            where: {
              phone: req.body.phone,
            }
          });
        }
      }
      else {
        let api = Kavenegar.KavenegarApi({
          apikey: '6D58546F68663949326476336B636A354F39542B474B47456D564A68504361377154414D78446D637263383D'
        });

        api.VerifyLookup({
          receptor: req.body.phone,
          token: code.toString(),
          template: "verificationCode",
        },
          async (response, status, message) => {

            if (status == 418) {
              sendEmail('info@parto.app', 'parto@parto.app', message, "ارور سامانه پیامکی ");
            }
            else if (status == 200) {

              await verification_code.create({
                phone: req.body.phone,
                code: code
              });
              console.log("userCode", code)
              return res.status(200).json({ data: { message: await translate("SUCCESSFUL", "fa") } }).end();
            }

            return res.status(status).json({ message: message });

          })
      }
    }
  }
  // else{
  //   const regex = RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{1,3})$/);
  //   let check=regex.test(req.body.email); 

  //   if (!check) return res.status(400).json({ message: await translate("INVALIDENTRY", "fa") });
  //   else{
  //     const subject='Verification Code for parto application ';
  //     let text =`کد فعالسازی شما : ${code}  `;
  //     const result=sendEmail('parto@parto.app',req.body.email,text,subject);
  //     if(result=="ERROR") return res.status(502).json({message: await translate("SERVERERROR", "fa")});
  //     else return res.status(200).json({data:{ message: await translate("SUCCESSFUL", "fa") , code:code}})
  //   }
  // }
});

router.post("/checkVerificationCode/:lang", async (req, res) => {
  // console.log(req.session);
  // console.log("code", req.session.code);
  // if (!req.session.code) {
  //   return res.status(402).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  // }
  console.log("ok");
  console.log("code", req.body.code)
  if (req.body.code == "" || req.body.code == null || req.body.phone == "" || req.body.phone == null) {
    return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  }
  let userExist = await verification_code.findOne({
    where: {
      phone: req.body.phone,
    }
  });
  console.log("user Exist", userExist);
  if (userExist != null) {

    if (new Date() - new Date(userExist.createdAt) > (2.5 * 60 * 1000)) {
      console.log("time expier");
      return res.status(408).json({ data: { message: await translate("TIMEOVER", req.params.lang) } }).end();
    }
    else {
      console.log(RegExp(userExist.code).test(req.body.code) == true)
      if (RegExp(userExist.code).test(req.body.code) == true) {
        await verification_code.destroy({
          where: {
            phone: req.body.phone,
          }
        });
        return res.status(200).json({ data: { message: await translate("SUCCESSFUL", req.params.lang) } })
      }
      else return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
    }
  }
  else return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
})

router.post("/partnerVerificationCode/:userId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null || usr == "" || req.body.partnerCode == null || req.body.partnerCode == "") {
    return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  }
  let str = req.body.partnerCode;
  //let code = str.substring(3, str.length);
  let userId = parseInt(str.substring(4, str.length - 2)) / 3;
  let checkSum = parseInt(str.substring(str.length - 2, str.length)) - 3;

  if ((userId.toString() + checkSum.toString()) % 77 != 1 || userId == req.params.userId) {
    return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  }

  let usrPartner = await user.findByPk(userId);
  if (usrPartner == null || usrPartner == "") return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  await usr.setUser(usrPartner);

  return res.status(200).json({ message: await translate("SUCCESSFUL", "fa") });
})

router.get("/partnerVerificationCode/:userId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  let checkSum = (78 - ((usr.id * 100) % 77)) % 77;
  let partnerCode = "PRT-" + (usr.id * 3) + (checkSum + 3);
  return res.status(200).json({ data: { partnerCode: partnerCode } });
})


module.exports = router;
