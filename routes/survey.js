const express = require("express");
const { user, survey_answers, user_answer_survey } = require("../models");
const auth = require("../middleware/auth");
const router = express.Router();
const translate = require("../config/translate");
const jwt = require("jsonwebtoken");
var fs = require("fs");
const useragent = require('useragent');
const secret = fs.readFileSync("../private.key", "utf8");

function authentication(req) {
  let token = "";
  const patt1 = RegExp('127.0.0.1*');
  const patt2 = RegExp('localhost*');

  if (patt2.test(req.headers.host) == true || useragent.is(req.headers['user-agent']).firefox == false &&
    useragent.is(req.headers['user-agent']).chrome == false &&
    useragent.is(req.headers['user-agent']).ie == false &&
    useragent.is(req.headers['user-agent']).mozilla == false &&
    useragent.is(req.headers['user-agent']).opera == false && useragent.is(req.headers['user-agent']).safari == false ||
    patt1.test(req.headers.host) == true || RegExp('https://dev.parto.app/api-doc').test(req.headers['origin']) == true ||
    RegExp('http://localhost:3925').test(req.headers['origin']) == true) {

    if (req.header("x-auth-token") == undefined) {
      return "401";
    }
    token = req.header("x-auth-token");
  }
  else {
    if (req.cookies.token == undefined) {
      return "401";
    }
    token = req.cookies.token;
  }
  console.log("tokenValu", token);
  if (token == "") return "401";

  let verification = true;
  jwt.verify(token, secret, function (err, decoded) {
    // err
    if (err) {
      verification = false;
    }
    else if (decoded) {
      if (decoded._id != req.params.userId && decoded._id != req.body.userId) {
        verification = false;
      }
      // req.user = decoded;
    }

  });

  if (verification == false) {
    return "400";
  }
  else return "200";
};


router.get("/question/:lang", async (req, res) => {
  let posetivQuestion = await survey_answers.findAll({
    attributes: ['id', 'question'],
    where: {
      weakness: 0,
    }
  });
  let negativeQuestion = await survey_answers.findAll({
    attributes: ['id', 'question'],
    where: {
      weakness: 1,
    }
  });

  res.status(200).json({ posetivQuestion: posetivQuestion, negativeQuestion: negativeQuestion });

});

router.post("/answers/:lang", async (req, res) => {

  if (!req.body.rate || req.body.rate == 0) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });

  if (req.body.IMEi != null && req.body.IMEi != "") {
    let usrSurvey = await user_answer_survey.findOne({
      where: {
        IMEI: req.body.IMEi
      }
    })
    if (usrSurvey != null) {
      await usrSurvey.update({
        answers: req.body.answers,
        description: req.body.description,
        rate: req.body.rate,
      })
    }
    else {
      await user_answer_survey.create({
        IMEI: req.body.IMEi,
        answers: req.body.answers,
        description: req.body.description,
        rate: req.body.rate
      })
    }
  }

  else if (req.body.userId != null && req.body.userId != 0) {
    let usr = await user.findByPk(req.body.userId);
    if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
    if (authentication(req) == "401") {
      return res.status(401).json({ message: await translate("NOPERMISSION", req.params.lang) });
    }
    else if (authentication(req) == "400") {
      return res.status(400).json({ message: await translate("INVALIDTOKEN", req.params.lang) });
    }

    let usrSurvey = await user_answer_survey.findOne({
      where: {
        userId: req.body.userId
      }
    })
    if (usrSurvey != null) {
      await usrSurvey.update({
        answers: req.body.answers,
        description: req.body.description,
        rate: req.body.rate,
      })
    }
    else {
      usrSurvey = await user_answer_survey.create({
        answers: req.body.answers,
        description: req.body.description,
        rate: req.body.rate
      })
      await usrSurvey.setUser(usr);
    }
  }
  else {
    return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  }
  return res.status(200).json({ message: await translate("SUCCESSFUL", req.params.lang) });
});
module.exports = router;
