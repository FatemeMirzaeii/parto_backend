const express = require("express");
const { user } = require("../models");
const bcrypt = require("bcrypt");
const router = express.Router();

router.post("/signUp", async (req, res) => {
  const exists = await user.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (exists) return res.status(400).json({ message: "شما قبلا ثبت نام کرده اید." });
  const hash = await bcrypt.hash(req.body.password, 10);
  const usr = await user.create({
    name: req.body.name,
    email: req.body.email,
    password: hash,
  });
  const token = usr.generateAuthToken();
  res.header("x-auth-token", token).status(200).json({ data: { id: usr.id } });
});

module.exports = router;
