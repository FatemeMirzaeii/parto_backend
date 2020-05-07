const express = require("express");
const auth = require("../middleware/auth");
const Note = require("../models/Note");
const router = express.Router();

router.get("/:userId/:date", auth, async (req, res) => {
  const note = await Note.findAll({
    where: {
      user_id: req.params.userId,
      note_date: req.params.date,
    },
  });
  if (note.length == 0) return res.status(204).json({ message: "برای امروز چیزی ثبت نکرده بودی :)" });
  res.status(200).json({ data: { content: note.content } });
});

router.post("/", auth, async (req, res) => {
  res.sendStatus(200).json({
    data: { headers: req.headers, params: req.params, body: req.body },
  });
});

module.exports = router;
