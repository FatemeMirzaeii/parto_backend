const express = require("express");
const auth = require("../middleware/auth");
const { note } = require("../models");
const router = express.Router();
const translate = require("../config/translate");

router.get("/:lang/:userId/:date", auth, async (req, res) => {
  const nt = await note.findAll({
    where: {
      user_id: req.params.userId,
      note_date: req.params.date,
    },
  });
  if (nt.length == 0) return res.status(404).json({ message: await translate("NONOTES", req.params.lang) });
  return res.status(200).json({ data: { content: nt.content } });
});

router.post("/", auth, async (req, res) => {
  res.sendStatus(200).json({
    data: { headers: req.headers, params: req.params, body: req.body },
  });
});

module.exports = router;
