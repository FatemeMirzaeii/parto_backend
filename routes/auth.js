
const express = require("express");
const { user, verification_code } = require("../models");
const router = express.Router();
const translate = require("../config/translate");
const sendEmail = require("../middleware/sendEmail");
const auth = require("../middleware/auth");
const Kavenegar = require('kavenegar');
const useragent = require('useragent');
const bcrypt = require("bcrypt");

function checkPhone(phone) {
  const regex = RegExp(/^(\98)9\d{9}$/g);
  return regex.test(phone);
}
function checkEmail(email) {
  const regex = RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{1,3})$/);
  return regex.test(email);
}
async function checkUserWithPhone(phone) {
  let userExist = await user.findOne({
    where: {
      phone: phone
    }
  })
  return userExist;
}
async function checkUserWithEmail(email, pass) {
  let userExist = await user.findOne({
    where: {
      email: email,
      password: pass
    }
  })
  return userExist;
}
async function sendSms(type, phone, code, template) {

  let api = Kavenegar.KavenegarApi({
    apikey: '6D58546F68663949326476336B636A354F39542B474B47456D564A68504361377154414D78446D637263383D'
  });
  return new Promise((resolve, reject) => {
    api.VerifyLookup({
      receptor: phone,
      token: code.toString(),
      template: template,
    },
      async (response, status, message) => {

        if (status == 418) {
          await sendEmail('parto@parto.email', 'Parvanebanoo.parto@gmail.com', message, "ارور سامانه پیامکی- بک اند ");
          await sendEmail('parto@parto.email', 'H.Aghashahi @parto.email', message, "ارور سامانه پیامکی- بک اند ");
        }
        resolve(status);
      })
  })
}

async function getCreateTime(userExist) {
  let createDate = new Date(userExist[userExist.length - 1].createdAt);
  let milliseconds = Date.parse(createDate);
  milliseconds = milliseconds - (((4 * 60) + 30) * 60 * 1000);
  return new Date() - new Date(milliseconds);
}

router.post("/signIn/:lang", async (req, res) => {
  let usr;
  if ((req.body.phone == "" || req.body.phone == null) &&
    (req.body.email == "" || req.body.email == null || req.body.password == "" || req.body.password == null) ||
    req.body.version == "" || req.body.version == null) {
    return res.status(400)
      .json({
        status: "error",
        data: {},
        message: await translate("INVALIDENTRY", req.params.lang)
      });
  }

  if (req.body.phone != null) {
    if (!checkPhone(req.body.phone))
      return res.status(400)
        .json({
          status: "error",
          data: {},
          message: await translate("INVALIDENTRY", req.params.lang)
        });
    usr = await checkUserWithPhone(req.body.phone);

    if (usr == null)
      return res.status(404)
        .json({
          status: "error",
          data: {},
          message: await translate("UERENOTFOUND", req.params.lang)
        });
  }
  else {
    if (!checkEmail(req.body.email))
      return res.status(400)
        .json({
          status: "error",
          data: {},
          message: await translate("INVALIDENTRY", req.params.lang)
        });
    usr = await checkUserWithEmail(req.body.email,req.body.password);

    if ( usr == null){
      return res.status(404)
        .json({
          status: "error",
          data: {},
          message: await translate("UERENOTFOUND", req.params.lang)
        });
    }
  }
  if (usr != null) {
    const token = await usr.generateAuthToken();
    await usr.createUser_log({
      i_p: req.header("x-forwarded-for"),
      version: req.body.version,
      login_date: Date.now(),
    });
    return res.header("x-auth-token", token).status(200)
      .json({
        status: "success",
        data: { id: usr.id, userName: usr.name },
        message: await translate("SUCCESSFUL", req.params.lang)
      });
  }
});

router.post("/signUp/:lang", async (req, res) => {
  if ((req.body.phone == "" || req.body.phone == null) &&
    (req.body.email == "" || req.body.email == null || req.body.password == "" || req.body.password == null) ||
    req.body.version == "" || req.body.version == null) {
    return res.status(400)
      .json({
        status: "error",
        data: {},
        message: await translate("INVALIDENTRY", req.params.lang)
      });
  }
  let request = {
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    password: req.body.password
  }
  let usr;
  if (req.body.phone != null) {
    if (!checkPhone(req.body.phone))
      return res.status(400)
        .json({
          status: "error",
          data: {},
          message: await translate("INVALIDENTRY", req.params.lang)
        });
    usr = await checkUserWithPhone(req.body.phone);
    if (usr != null)
      return res.status(409)
        .json({
          status: "error",
          data: {},
          message: await translate("EXISTS", req.params.lang)
        });

  }
  if (req.body.email != null) {
    if (!checkEmail(req.body.email))
      return res.status(400)
        .json({
          status: "error",
          data: {},
          message: await translate("INVALIDENTRY", req.params.lang)
        });
    usr = await user.findOne({
      where: {
        email: req.body.email,
      }
    })
    if (usr != null)
      return res.status(409)
        .json({
          status: "error",
          data: {},
          message: await translate("EXISTS", req.params.lang)
        });

  }

  usr = await user.create(request);
  const token = await usr.generateAuthToken();
  await usr.createUser_log({
    i_p: req.header("x-forwarded-for"),
    version: req.body.version,
    login_date: Date.now(),
  });
  return res.header("x-auth-token", token).status(200)
    .json({
      status: "success",
      data: { id: usr.id, userName: usr.name },
      message: await translate("SUCCESSFUL", req.params.lang)
    });

});

router.post("/verificationCode", async (req, res) => {
  let flag = true;
  let code = Math.floor(Math.random() * (99999 - 10000 + 1) + 10000);
  if (req.body.phone == "" || req.body.phone == null) {
    return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  }
  console.log("lock", req.body.type == "lock");
  if (req.body.type != undefined && req.body.type == "lock") {
    code = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
  }
  if (req.body.phone != "") {
    const regex = RegExp(/^(\98)9\d{9}$/g);
    let check = regex.test(req.body.phone);

    if (!check) return res.status(400).json({ message: await translate("INVALIDENTRY", "fa") });
    else {
      let userExist;
      if (req.body.type != undefined && req.body.type == "lock") {
        userExist = await verification_code.findAll({
          where: {
            phone: req.body.phone,
            type: "lock"
          }
        });
      }
      else {
        userExist = await verification_code.findAll({
          where: {
            phone: req.body.phone,
            type: "login"
          }
        });
      }
      console.log("flag", flag);
      console.log("userExist", userExist);
      if (userExist.length > 0) {

        let createAt = new Date(userExist[userExist.length - 1].createdAt);
        let milliseconds = Date.parse(createAt);
        milliseconds = milliseconds - (((4 * 60) + 30) * 60 * 1000);

        if (new Date() - new Date(milliseconds) < (2 * 60 * 1000)) {
          flag = false;
          return res.status(409).json({ message: "لطفا پس از  دو دقیقه دوباره درخواست دهید" });
        }
        else if (new Date() - new Date(milliseconds) > (2 * 60 * 1000)) {
          for (const element of userExist) {
            await element.destroy();
          }
          flag = true;
        }
      }

      if (flag == true) {
        console.log("kavenegar");
        let api = Kavenegar.KavenegarApi({
          apikey: '6D58546F68663949326476336B636A354F39542B474B47456D564A68504361377154414D78446D637263383D'
        });
        let template = "verificationCode";
        if (req.body.type == "lock") { template = "lockCode" }
        api.VerifyLookup({
          receptor: req.body.phone,
          token: code.toString(),
          template: template,
        },
          async (response, status, message) => {
            console.log("status", status);
            if (status == 418) {
              await sendEmail('parto@parto.email', 'Parvanebanoo.parto@gmail.com', message, "ارور سامانه پیامکی ");
              await sendEmail('parto@parto.email', 'H.Aghashahi @parto.email', message, "ارور سامانه پیامکی ");
            }
            else if (status == 200) {
              if (req.body.type == "lock") {
                console.log("heare");
                await verification_code.create({
                  phone: req.body.phone,
                  code: code,
                  type: "lock"
                });
              }
              else {
                await verification_code.create({
                  phone: req.body.phone,
                  code: code,
                  type: "login"
                });

              }
              console.log("userCode", code)
              return res.status(200).json({ message: await translate("SUCCESSFUL", "fa") }).end();
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
  if (req.body.code == "" || req.body.code == null || req.body.phone == "" || req.body.phone == null) {
    return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  }
  let userExist;
  if (req.body.type != undefined && req.body.type == "lock") {
    userExist = await verification_code.findAll({
      where: {
        phone: req.body.phone,
        type: "lock"
      }
    });
  }
  else {
    userExist = await verification_code.findAll({
      where: {
        phone: req.body.phone,
        type: "login"
      }
    });
  }
  // console.log("user Exist", userExist);
  if (userExist.length == 0) {
    return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  }
  else {
    let createAt = new Date(userExist[userExist.length - 1].createdAt);
    let milliseconds = Date.parse(createAt);
    milliseconds = milliseconds - (((4 * 60) + 30) * 60 * 1000);

    if (new Date() - new Date(milliseconds) > (2 * 60 * 1000)) {
      console.log("time expier");
      return res.status(408).json({ message: await translate("TIMEOVER", req.params.lang) }).end();
    }
    else {
      console.log("code", userExist[userExist.length - 1].code)
      if (userExist[userExist.length - 1].code != req.body.code) {
        return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
      }
      for (const element of userExist) {
        await element.destroy();
      }
      return res.status(200).json({ message: await translate("SUCCESSFUL", req.params.lang) });

    }
  }

});

router.post("/logIn/:lang", async (req, res) => {
  const patt1 = RegExp('127.0.0.1*');
  const patt2 = RegExp('localhost*');
  let usr;
  let version;
  console.log("phone", req.body.phone)
  if (req.body.phone == "" || req.body.phone == null) {
    return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  }
  if (req.body.phone != "") {
    const regex = RegExp(/^(?:[0-9] ?){5,13}[0-9]$/);
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
        name: null,
        phone: req.body.phone,
        version_type: null,
        //email: req.body.email,
        //password: hash,
        imei: req.body.imei
      });
    }
    else {
      usr = await user.create({
        name: null,
        phone: req.body.phone,
        version_type: null
      });
    }
  }
  const token = await usr.generateAuthToken();

  if (RegExp('http://localhost:3925').test(req.headers['origin']) == true) {
    return res.status(200).json({ data: { id: usr.id, token: token, userName: usr.name, type: usr.version_type } });
  }
  else if (useragent.is(req.headers['user-agent']).firefox == false &&
    useragent.is(req.headers['user-agent']).chrome == false &&
    useragent.is(req.headers['user-agent']).ie == false &&
    useragent.is(req.headers['user-agent']).mozilla == false &&
    useragent.is(req.headers['user-agent']).opera == false && useragent.is(req.headers['user-agent']).safari == false ||
    patt1.test(req.headers.host) == true || patt2.test(req.headers.host) == true || RegExp('https://dev.parto.app/api-doc').test(req.headers['origin']) == true) {

    await usr.createUser_log({
      i_p: req.header("x-forwarded-for"),
      version: "android",
      login_date: Date.now(),
    });
    return res.header("x-auth-token", token).status(200).json({ data: { id: usr.id, userName: usr.name, type: usr.version_type } });

  }
  else {
    await usr.createUser_log({
      i_p: req.header("x-forwarded-for"),
      version: "PWA",
      login_date: Date.now(),
    });
    res.clearCookie('token');
    return res
      .cookie("token", await token, { httpOnly: true, expires: false, secure: true, maxAge: 10 * 365 * 24 * 60 * 60 * 1000 })
      .status(200)
      .json({ data: { id: usr.id, userName: usr.name, type: usr.version_type } });
  }

})

router.put("/forgetPassword/:lang", async (req, res) => {
  let usr;
  if (req.body.email == "" || req.body.email == null || req.body.newPassword == "" || req.body.newPassword == null) {
    return res.status(400)
      .json({
        status: "error",
        data: {},
        message: await translate("INVALIDENTRY", req.params.lang)
      });
  }

  if (!checkEmail(req.body.email))
    return res.status(400)
      .json({
        status: "error",
        data: {},
        message: await translate("INVALIDENTRY", req.params.lang)
      });
  usr = await user.findOne({
    where: {
      email: req.body.email
    }
  })
  if (usr == null)
    return res.status(404)
      .json({
        status: "error",
        data: {},
        message: await translate("UERENOTFOUND", req.params.lang)
      });
  else {
    await usr.update({ password: req.body.newPassword });
  }
  return res.status(200)
    .json({
      status: "success",
      data: {},
      message: await translate("SUCCESSFUL", req.params.lang)
    });
});

router.put("/changePassword/:lang", async (req, res) => {
  let usr;
  if (req.body.email == "" || req.body.email == null || req.body.password == "" || req.body.password == null ||
    req.body.newPassword == "" || req.body.newPassword == null) {
    return res.status(400)
      .json({
        status: "error",
        data: {},
        message: await translate("INVALIDENTRY", req.params.lang)
      });
  }

  if (!checkEmail(req.body.email))
    return res.status(400)
      .json({
        status: "error",
        data: {},
        message: await translate("INVALIDENTRY", req.params.lang)
      });
  usr = await checkUserWithEmail(req.body.email,req.body.password);
  if (await usr == null)
    return res.status(404)
      .json({
        status: "error",
        data: {},
        message: await translate("UERENOTFOUND", req.params.lang)
      });
  else {
    await usr.update({ password: req.body.newPassword });
  }
  return res.status(200)
    .json({
      status: "success",
      data: {},
      message: await translate("SUCCESSFUL", req.params.lang)
    });
});

router.post("/v2/verificationCode/:lang", async (req, res) => {
  if ((req.body.phone == "" || req.body.phone == null) && (req.body.email == "" || req.body.email == null)) {
    return res.status(400)
      .json({
        status: "error",
        data: {},
        message: await translate("INVALIDENTRY", req.params.lang)
      });
  }
  let flag = true;
  let code = Math.floor(Math.random() * (99999 - 10000 + 1) + 10000);
  let type = "login";
  if (req.body.type != undefined && req.body.type == "lock") {
    code = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
    type = "lock";
  }

  let userExist;
  let time;
  if (req.body.phone != null) {
    time = (2 * 60 * 1000);
    if (!checkPhone(req.body.phone))
      return res.status(400)
        .json({
          status: "error",
          data: {},
          message: await translate("INVALIDENTRY", req.params.lang)
        });
    userExist = await verification_code.findAll({
      where: {
        phone: req.body.phone,
        type: type
      }
    });
  }
  else {
    time = (10 * 60 * 1000);
    if (!checkEmail(req.body.email))
      return res.status(400)
        .json({
          status: "error",
          data: {},
          message: await translate("INVALIDENTRY", req.params.lang)
        });
    userExist = await verification_code.findAll({
      where: {
        email: req.body.email,
        type: type
      }
    });
  }
  console.log("exist", userExist);
  if (userExist.length > 0) {
    if (await getCreateTime(userExist) < time) {

      flag = false;
      return res.status(409)
        .json({
          status: "error",
          data: {},
          message: "دقیقه دوباره درخواست دهید " + time / 60000 + "لطفا پس از"
        });
    }
    else if (await getCreateTime(userExist) > time) {
      for (const element of userExist) {
        await element.destroy();
      }
      flag = true;
    }
  }

  if (flag == true) {

    let template = "verificationCode";
    if (type == "lock") template = "lockCode";
    let result;
    // send Email
    if (req.body.phone != null) {
      result = await sendSms(type, req.body.phone, code, template);
      if (result == 200) {
        await verification_code.create({
          phone: req.body.phone,
          code: code,
          type: type
        })
      }
    }
    else {
      let subject = ` Parto- ${template}  `;
      let text = `کد فعالسازی شما : ${code}  `;
      result = await sendEmail('parto@parto.email', req.body.email, text, subject);

      await verification_code.create({
        email: req.body.email,
        code: code,
        type: type
      })

    }
    console.log("resultttttttttt", result);
    if (result == 200) {
      return res.status(200).json({
        status: "success",
        data: {},
        message: await translate("SUCCESSFUL", req.params.lang)
      });
    }
    else return res.status(502)
      .json({
        status: "error",
        data: {},
        message: await translate("SERVERERROR", req.params.lang)
      });
  }

});

router.post("/v2/checkVerificationCode/:lang", async (req, res) => {
  if (req.body.code == "" || req.body.code == null ||
    ((req.body.phone == "" || req.body.phone == null) && (req.body.email == "" || req.body.email == null))) {
    return res.status(400)
      .json({
        status: "error",
        data: {},
        message: await translate("INVALIDENTRY", req.params.lang)
      });
  }
  let type = "login";
  if (req.body.type != undefined && req.body.type == "lock") {
    type = "lock";
  }

  let userExist;
  let time;
  if (req.body.phone != null) {
    time = (2 * 60 * 1000);
    userExist = await verification_code.findAll({
      where: {
        phone: req.body.phone,
        type: type
      }
    });
  }
  else {
    time = (10 * 60 * 1000);
    userExist = await verification_code.findAll({
      where: {
        email: req.body.email,
        type: type
      }
    });
  }

  if (userExist.length == 0) {
    return res.status(404)
      .json({
        status: "error",
        data: {},
        message: await translate("INFORMATIONNOTFOUND", req.params.lang)
      });
  }
  else {
    if (await getCreateTime(userExist) > time) {
      console.log("time expier");
      return res.status(408)
        .json({
          status: "error",
          data: {},
          message: await translate("TIMEOVER", req.params.lang)
        });
    }
    else {
      console.log("code", userExist[userExist.length - 1].code)
      if (userExist[userExist.length - 1].code != req.body.code) {
        return res.status(400)
          .json({
            status: "error",
            data: {},
            message: await translate("INVALIDCODE", req.params.lang)
          });
      }
      for (const element of userExist) {
        await element.destroy();
      }
    }
  }
  return res.status(200).json({
    status: "success",
    data: {},
    message: await translate("SUCCESSFUL", req.params.lang)
  });
});

module.exports = router;
