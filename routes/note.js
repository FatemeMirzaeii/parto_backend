const express = require("express");
const auth = require("../middleware/auth");
const Note = require("../models/Note");
const router = express.Router();

router.get("/:userId/:date", auth, (req, res, next) => {
  Note.findAll({
    where: {
      user_id: req.params.userId,
      note_date: req.params.date,
    },
  })
    .then((note) => {
      res.send(note.content);
    })
    .catch(next);
});

router.post("/", auth, (req, res) => {
  res.send(req.headers, req.params, req.body);
});

module.exports = router;
