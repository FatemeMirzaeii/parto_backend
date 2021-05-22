const express = require("express");
const auth = require("../middleware/auth");
const { note, user } = require("../models");
const router = express.Router();
const translate = require("../config/translate");
const handleError = require("../middleware/handleMysqlError");

// router.get("/:userId/:noteDate/:lang", auth, async (req, res) => {
//   let usr = await user.findByPk(req.params.userId);
//   if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });

//   const nt = await note.findAll({
//     attributes: ['id', 'title', 'content', ['note_date','noteDate']],
//     where: {
//       user_id: req.params.userId,
//       note_date: req.params.noteDate,
//     },
//   });
//   if (nt == null) return res.status(404).json({ message: await translate("NONOTES", req.params.lang) });
//   return res.status(200).json({ data: nt });
// });
router.get("/:userId/:noteId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });

  const nt = await note.findOne({
    attributes: ['id', 'title', 'content', ['note_date', 'noteDate']],
    where: {
      id: req.params.noteId,
    },
  });
  if (nt == null) return res.status(404).json({ message: await translate("NONOTES", req.params.lang) });
  return res.status(200).json({ data: nt });
});
router.get("/:userId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });

  const nt = await note.findAll({
    attributes: ['id', 'title', 'content', ['note_date', 'noteDate']],
    where: {
      user_id: req.params.userId
    },
  });
  if (nt.length == 0) return res.status(404).json({ message: await translate("INFORMATIONNOTFOUND", req.params.lang) });

  return res.status(200).json({ data: nt });
});
router.post("/:userId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null || req.body.noteDate == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  if (req.body.content == null && req.body.title == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });

  let nt = await note.findOne({
    where: {
      title: req.body.title,
      content: req.body.content,
      note_date: req.body.noteDate,
      user_id:req.params.userId
    },
  });
  if(nt!=null) return res.status(200).json({ data: { noteId: nt.id } });
  let request = {
    title: req.body.title,
    content: req.body.content,
    note_date: req.body.noteDate
  }

  let newNote;
  try {
    newNote = await note.create(request);
    if (newNote != null) {
      await newNote.setUser(usr).catch(async function (err) {
        let result2 = await handleError(newNote, err);
        if (!result2) error = 1;
        return;
      })
    }
  } catch (err) {
    let result3 = await handleError(newNote, err);
    if (!result3) error = 1;
    return;
  }

  return res.status(200).json({ data: { noteId: newNote.id } });
});

router.put("/:userId/:noteId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null || req.body.noteDate == null || req.params.noteId == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  if (req.body.content == null && req.body.title == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });

  let request = {
    title: req.body.title,
    content: req.body.content,
    note_date: req.body.noteDate
  }
  let nt = await note.findOne({
    where: {
      id: req.params.noteId,
    },
  });
  if (nt == null) return res.status(404).json({ message: await translate("NONOTES", req.params.lang) });
  else await nt.update(request);

  return res.status(200).json({ message: await translate("SUCCESSFUL", req.params.lang) });
});

router.delete("/:userId/:noteId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });

  const nt = await note.destroy({
    where: {
      id: req.params.noteId
    },
  });
  return res.status(200).json({ message: await translate("SUCCESSFUL", req.params.lang) });
});

router.delete("/:userId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });

  const nt = await note.destroy({
    where: {
      user_id: req.params.userId,
    },
  });
  return res.status(200).json({ message: await translate("SUCCESSFUL", req.params.lang) });
});

module.exports = router;
