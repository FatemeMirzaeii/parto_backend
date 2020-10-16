const jwt = require("jsonwebtoken");
var fs = require("fs");
const translate = require("../config/translate");
const { user } = require("../models");
const secret = fs.readFileSync("../private.key", "utf8");
var cookie = require('cookie');

module.exports = async function (req, res, next) {
  
  var cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies.xAuthToken;
  if (!token)   return res.status(401).json({ message: await translate("NOPERMISSION", req.params.lang) });
  
  let verification=true;
  jwt.verify(token, secret, function(err, decoded) {
    // err
    if(err){
      verification=false;
      }
    else if(decoded){
      if(decoded._id!=req.params.userId && decoded._id!=req.body.userId){
          verification=false;
      } 
      // req.user = decoded;
    }
    
  });
  if(verification==false){
    res.status(400).json({ message: await translate("INVALIDTOKEN", req.params.lang) });
  } 
  else return next();
  
};
