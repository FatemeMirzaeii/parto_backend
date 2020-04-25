const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const router = express.Router();
router.post("/signUp", (req, res) => {
  const schema = {
    name: Joi.string().min(1).max(50).required(),
    //username: Joi.string().min(3).max(255).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),
  };
  const { error } = Joi.validate(req.body, schema);
  if (error) return res.status(400).send(error.details[0].message);

  User.findOne({
    where: {
      email: req.body.email,
    },
  }).then((user) => {
    if (user) return res.status(400).send("شما قبلا ثبت نام کرده اید.");
  });
  bcrypt.hash(req.body.password, 10).then((hash) => {
    User.create({
      name: req.body.name,
      email: req.body.email,
      password: hash,
    }).then((user) => {
      const token = user.generateAuthToken();
      res.header("x-auth-token", token).send("new user Id is: " + user.id);
    });
  });
});

module.exports = router;
