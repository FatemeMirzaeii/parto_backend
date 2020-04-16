const express = require("express");
const Note = require("../models/Note");
const Joi = require("joi");
const router = express.Router();

router.get("/:userId/:date", (req, res) => {
  const schema = {
    userId: Joi.number().positive().integer().required(),
    date: Joi.date(),
  };
  const result = Joi.validate(req.params, schema);
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }
  Note.findAll({
    where: {
      user_id: req.params.userId,
      note_date: req.params.date,
    },
  }).then((note) => {
    res.send(note.content);
  });
});

router.post("/", (req, res) => {
  const schema = {
    userId: Joi.number().positive().integer().required(),
    date: Joi.date().required(),
    content: Joi.string().min(1),
  };
  const result = Joi.validate(req.body, schema);
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }
  res.send(req.headers, req.params, req.body);
});

module.exports = router;
