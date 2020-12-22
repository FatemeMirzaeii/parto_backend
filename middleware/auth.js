const jwt = require("jsonwebtoken");
var fs = require("fs");
const translate = require("../config/translate");
const { user } = require("../models");
const secret = fs.readFileSync("../private.key", "utf8");
const useragent = require('useragent');


module.exports = async function (req, res, next) {
  let token;
  console.log("app-type",RegExp('pwa').test(req.header("app-type")) == true);
  if (RegExp('pwa').test(req.header("app-type")) == true){
    console.log("read cookie");
    if (req.cookies.token == undefined) {
      return res.status(401).json({ message: await translate("NOPERMISSION", req.params.lang) });
    }
    token = req.cookies.token;
  }
  else {
    console.log("read x-auth-token");
    console.log(req.header("x-auth-token"));
    console.log(req.header("x-auth-token") == undefined);
    console.log(RegExp('undefined').test(req.header("x-auth-token")) == true);
    console.log(req.header("x-auth-token") === undefined);
    console.log(RegExp(undefined).test(req.header("x-auth-token")) == true);
    console.log(req.header("x-auth-token") == 'undefined');
    if (req.header("x-auth-token") == undefined) {
     return res.status(401).json({ message: await translate("NOPERMISSION", req.params.lang) });
    }
    token = req.header("x-auth-token");
  }

  console.log("token", token);
  if (!token) return res.status(401).json({ message: await translate("NOPERMISSION", req.params.lang) });

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
    res.status(400).json({ message: await translate("INVALIDTOKEN", req.params.lang) });
  }
  else return next();

};
