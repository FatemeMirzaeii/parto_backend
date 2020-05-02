const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const router = express.Router();

router.post("/signUp", (req, res, next) => {
  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      if (user) return res.status(400).send("شما قبلا ثبت نام کرده اید.");
    })
    .catch(next);
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash,
      }).then((user) => {
        const token = user.generateAuthToken();
        res.header("x-auth-token", token).send("new user Id is: " + user.id);
      });
    })
    .catch(next);
});

module.exports = router;
