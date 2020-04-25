const jwt = require("jsonwebtoken");
var fs = require("fs");

const secret = fs.readFileSync("./private.key", "utf8");

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("شما مجوز دسترسی ندارید.");
  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("مجوز نامعتبر");
  }
};
