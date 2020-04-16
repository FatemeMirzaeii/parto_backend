const express = require("express");
const User = require("../models/User");
const Joi = require("joi");
const router = express.Router();

router.post("/signIn", (req, res) => {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),
  };
  const { error } = Joi.validate(req.body, schema);
  if (error) return res.status(400).send("اطلاعات وارد شده صحیح نیست.");

  User.findAll({
    where: {
      email: req.body.email,
    },
  }).then((user) => {
    if (!user || user.password != req.body.password)
      return res.status(400).send("اطلاعات وارد شده صحیح نیست.");
  });
  res.send(true);
});
//todo: incomplete
router.post("/signOut", (req, res) => {
  const schema = {};
  const { error } = Joi.validate(req.body, schema);
  if (error) return res.status(400).send(result.error.details[0].message);
  res.send(req.headers, req.params, req.body);
});

router.post("/forgotPassword", (req, res) => {
  const schema = {};
  const { error } = Joi.validate(req.body, schema);
  if (error) return res.status(400).send(result.error.details[0].message);
  res.send(req.headers, req.params, req.body);
});

router.post("/changePassword", (req, res) => {
  const schema = {};
  const { error } = Joi.validate(req.body, schema);
  if (error) return res.status(400).send(result.error.details[0].message);
  res.send(req.headers, req.params, req.body);
});

router.post("/sendVerificationCode", (req, res) => {
  const schema = {};
  const { error } = Joi.validate(req.body, schema);
  if (error) return res.status(400).send(result.error.details[0].message);
  res.send(req.headers, req.params, req.body);
});
module.exports = router;
