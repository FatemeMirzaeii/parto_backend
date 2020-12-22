const jwt = require("jsonwebtoken");
var fs = require("fs");
const translate = require("../config/translate");
const { user } = require("../models");
const secret = fs.readFileSync("../private.key", "utf8");
const useragent = require('useragent');


module.exports = async function (req, res, next) {
  let token;
  console.log("app-type",req.header("app-type")=="pwa");
  if (req.header("app-type")=="pwa"){
    if (req.cookies.token == undefined) {
      return res.status(401).json({ message: await translate("NOPERMISSION", req.params.lang) });
    }
    token = req.cookies.token;
  }
  else {
    if (req.header("x-auth-token") == undefined) {
      res.status(401).json({ message: await translate("NOPERMISSION", req.params.lang) });
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
