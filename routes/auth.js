
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
    useragent.is(req.headers['user-agent']).opera == false,
    useragent.is(req.headers['user-agent']).safari)
  if (RegExp('http://localhost:3925').test(req.headers['origin']) == true  ) {
    return res.status(200).json({ data: { id: usr.id, token: token, userName: usr.name} });
  }
  else if (useragent.is(req.headers['user-agent']).firefox == false &&
    useragent.is(req.headers['user-agent']).chrome == false &&
    useragent.is(req.headers['user-agent']).ie == false &&
    useragent.is(req.headers['user-agent']).mozilla == false &&
    useragent.is(req.headers['user-agent']).opera == false && useragent.is(req.headers['user-agent']).safari == false ||
    patt1.test(req.headers.host) == true || patt2.test(req.headers.host) == true || RegExp('https://dev.parto.app/api-doc').test(req.headers['origin']) == true) {
    console.log("set headersssss");
    return res.header("x-auth-token", token).status(200).json({ data: { id: usr.id, userName: usr.name} });

  }
  else {
    console.log("set cookiessssssssss");
    res.clearCookie('token');
    return res
      .cookie("token", await token, { httpOnly: true, expires: false, secure: true, maxAge: 10 * 365 * 24 * 60 * 60 * 1000 })
      .status(200)
      .json({ data: { id: usr.id, userName: usr.name} });
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

router.post("/linkForgotPassword/:lang", async (req, res) => {
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


module.exports = router;
