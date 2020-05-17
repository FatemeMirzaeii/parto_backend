const jwt = require("jsonwebtoken");
var fs = require("fs");

const secret = fs.readFileSync("../private.key", "utf8");

module.exports = function (req, res, next) {
  const token = req.header("x_auth_token");
  console.log(req.headers);
  if (!token) return res.status(401).json({ message: "شما مجوز دسترسی ندارید." });
  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).json({ message: "مجوز نامعتبر" });
  }
};
