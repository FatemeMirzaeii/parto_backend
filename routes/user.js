const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const router = express.Router();

router.post("/signUp", async (req, res) => {
  const exists = await User.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (exists) return res.status(400).json({ message: "شما قبلا ثبت نام کرده اید." });
  const hash = await bcrypt.hash(req.body.password, 10);
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: hash,
  });
  const token = user.generateAuthToken();
  res.header("x-auth-token", token).status(200).json({ data: { id: user.id } });
});

module.exports = router;
