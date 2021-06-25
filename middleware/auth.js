const jwt = require("jsonwebtoken");
var fs = require("fs");
const translate = require("../config/translate");
const secret = fs.readFileSync("../private.key", "utf8");
const useragent = require('useragent');
const { user } = require("../models");


module.exports = async function (req, res, next) {
  let token;
  const patt1 = RegExp('127.0.0.1*');
  const patt2 = RegExp('localhost*');

  if (patt2.test(req.headers.host) == true || useragent.is(req.headers['user-agent']).firefox == false &&
    useragent.is(req.headers['user-agent']).chrome == false &&
    useragent.is(req.headers['user-agent']).ie == false &&
    useragent.is(req.headers['user-agent']).mozilla == false &&
    useragent.is(req.headers['user-agent']).opera == false && useragent.is(req.headers['user-agent']).safari == false ||
    patt1.test(req.headers.host) == true || RegExp('https://dev.parto.app/api-doc').test(req.headers['origin']) == true ||
    RegExp('http://localhost:3925').test(req.headers['origin']) == true || RegExp('http://localhost:2216').test(req.headers['origin']) == true) {

    if (req.header("x-auth-token") == undefined) {
      return res.status(401)
        .json({
          status: "error",
          data: {},
          message: await translate("NOPERMISSION", req.params.lang)
        });
    }
    token = req.header("x-auth-token");
  }
  else {

    if (req.cookies.token == undefined) {
      return res.status(401)
        .json({
          status: "error",
          data: {},
          message: await translate("NOPERMISSION", req.params.lang)
        });
    }
    token = req.cookies.token;
  }
  console.log("token", token);
  if (!token) return res.status(401)
    .json({
      status: "error",
      data: {},
      message: await translate("NOPERMISSION", req.params.lang)
    });

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
    return res.status(401)
      .json({
        status: "error",
        data: {},
        message: await translate("INVALIDTOKENORUSERID", req.params.lang)
      });
  }
  else if (await user.findByPk(req.params.userId) == null && await user.findByPk(req.body.userId) == null) {
    return res.status(404)
      .json({
        status: "error",
        data: {},
        message: await translate("UERENOTFOUND", req.params.lang)
      });
  }
  else return next();

};
