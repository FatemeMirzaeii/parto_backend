const express = require("express");
const auth = require("../middleware/auth");
const { note } = require("../models");
const router = express.Router();

router.get("/:userId/:date", auth, async (req, res) => {
  const nt = await note.findAll({
    where: {
      user_id: req.params.userId,
      note_date: req.params.date,
    },
  });
  if (nt.length == 0) return res.status(204).json({ message: "برای امروز چیزی ثبت نکرده بودی :)" });
  res.status(200).json({ data: { content: nt.content } });
});

router.post("/", auth, async (req, res) => {
  res.sendStatus(200).json({
    data: { headers: req.headers, params: req.params, body: req.body },
  });
});

module.exports = router;
