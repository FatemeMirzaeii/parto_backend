const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const router = express.Router();

router.post("/signIn", async (req, res) => {
  const user = await User.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (!user) return res.status(400).json({ message: "اطلاعات وارد شده صحیح نیست." });
  const pass = await bcrypt.compare(req.body.password, user.password);
  if (!pass) return res.status(400).json({ message: "رمز نامعتبر" });
  const token = user.generateAuthToken();
  res.header("x-auth-token", token).status(200).json({ data: { id: user.id } });
});

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
