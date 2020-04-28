const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const router = express.Router();

router.post("/signIn", (req, res) => {
  User.findOne({
    where: {
      email: req.body.email,
    },
  }).then((user) => {
    if (!user) return res.status(400).send("اطلاعات وارد شده صحیح نیست.");
    bcrypt.compare(req.body.password, user.password).then((result) => {
      if (!result) return res.status(400).send("رمز نامعتبر");
      const token = user.generateAuthToken();
      res.header("x-auth-token", token);
    });
  });
});
// !!!!!!!!!!!!!!!! sign out should be implemented in client-side !!!!!!!!!!!!!!!!!!!!!!!!!!!
// router.post("/signOut", (req, res) => {
//   res.send(req.headers, req.params, req.body);
// });

//todo: incomplete
router.post("/forgotPassword", (req, res) => {
  res.send(req.headers, req.params, req.body);
});

router.post("/changePassword", (req, res) => {
  res.send(req.headers, req.params, req.body);
});

router.post("/sendVerificationCode", (req, res) => {
  res.send(req.headers, req.params, req.body);
});
module.exports = router;
