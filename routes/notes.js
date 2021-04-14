const express = require("express");
const auth = require("../middleware/auth");
const { note, user } = require("../models");
const router = express.Router();
const translate = require("../config/translate");
const handleError = require("../middleware/handleMysqlError");

router.get("/:userId/:noteDate/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
   
  const nt = await note.findOne({
    where: {
      user_id: req.params.userId,
      note_date: req.params.noteDate,
    },
  });
  if (nt==null) return res.status(404).json({ message: await translate("NONOTES", req.params.lang) });
  return res.status(200).json({ data: { title: nt.title, content: nt.content } });
});
router.get("/:userId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
   
  const nt = await note.findAll({
    attributes: [['note_Date','noteDate'],'title','content'],
    where: {
      user_id: req.params.userId
    },
  });
  if (nt.length==0) return res.status(404).json({ message: await translate("INFORMATIONNOTFOUND", req.params.lang) });
  
  return res.status(200).json({ data: nt });
});
router.post("/:userId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null || req.body.noteDate== null ||req.body.content==null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
   
  let nt = await note.findOne({
    where: {
      user_id: req.params.userId,
      note_date: req.body.noteDate,
    },
  });
  let request = {
    title: req.body.title,
    content: req.body.content,
    note_date: req.body.noteDate
  }
  if (nt == null) {
    try {
      nt = await note.create(request);
      if (nt != null) {
        await nt.setUser(usr).catch(async function (err) {
          let result2 = await handleError(nt, err);
          if (!result2) error = 1;
          return;
        })
      }
    } catch (err) {
      let result3 = await handleError(nt, err);
      if (!result3) error = 1;
      return;
    }
  }
  else{
    await nt.update(request);
  }
  return res.status(200).json({ message: await translate("SUCCESSFUL", req.params.lang)});
});

router.delete("/:userId/:noteDate/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
   
  const nt = await note.destroy({
    where: {
      user_id: req.params.userId,
      note_date: req.params.noteDate,
    },
  });
  return res.status(200).json({ message: await translate("SUCCESSFUL", req.params.lang)});
});

router.delete("/:userId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
   
  const nt = await note.destroy({
    where: {
      user_id: req.params.userId,
    },
  });
  return res.status(200).json({ message: await translate("SUCCESSFUL", req.params.lang)});
});

module.exports = router;
