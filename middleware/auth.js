const jwt = require("jsonwebtoken");
var fs = require("fs");
const translate = require("../config/translate");
const { user } = require("../models");
const secret = fs.readFileSync("../private.key", "utf8");
var cookie = require('cookie');

module.exports = async function (req, res, next) {
  let token;
  if(useragent.is(req.headers['user-agent']).android==true &&
      useragent.is(req.headers['user-agent']).firefox == false &&
      useragent.is(req.headers['user-agent']).chrome == false &&
      useragent.is(req.headers['user-agent']).ie == false &&
      useragent.is(req.headers['user-agent']).mozilla == false &&
      useragent.is(req.headers['user-agent']).opera == false ){
        
    token=req.headers.req.header("x-auth-token");
  }  
  else{
    token = req.cookies.token;
  }
  console.log("token",token);
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
