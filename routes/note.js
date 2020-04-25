const express = require("express");
const auth = require("../middleware/auth");
const Note = require("../models/Note");
const Joi = require("joi");
const router = express.Router();

router.get("/:userId/:date", auth, (req, res) => {
  const schema = {
    userId: Joi.number().positive().integer().required(),
    date: Joi.date(),
  };
  const { error } = Joi.validate(req.params, schema);
  if (error) return res.status(400).send(result.error.details[0].message);

  Note.findAll({
    where: {
      user_id: req.params.userId,
      note_date: req.params.date,
    },
  }).then((note) => {
    res.send(note.content);
  });
});

router.post("/", auth, (req, res) => {
  const schema = {
    userId: Joi.number().positive().integer().required(),
    date: Joi.date().required(),
    content: Joi.string().min(1),
  };
  const { error } = Joi.validate(req.body, schema);
  if (error) return res.status(400).send(result.error.details[0].message);

  res.send(req.headers, req.params, req.body);
});

module.exports = router;
