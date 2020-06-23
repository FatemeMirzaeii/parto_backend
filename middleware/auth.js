const jwt = require("jsonwebtoken");
var fs = require("fs");
const translate = require("../config/translate");

const secret = fs.readFileSync("../private.key", "utf8");

module.exports = async function (req, res, next) {
  const token = req.header("x-auth-token");
  
  if (!token) return  res.status(401).json({ message: await translate("NOPERMISSION", req.params.lang) });
  try {
    const decoded = await jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).json({ message: await translate("INVALIDTOKEN", req.params.lang) });
  }
};
