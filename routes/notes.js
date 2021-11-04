const express = require("express");
const auth = require("../middleware/auth");
const { note, user } = require("../models");
const router = express.Router();
const translate = require("../config/translate");
const handleError = require("../middleware/handleMysqlError");
const { Op } = require("sequelize");
const moment = require("moment");

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
  if (usr == null || req.body.noteDate == null || req.body.noteDate == undefined || req.body.noteDate == "") {
    return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  }
  if ((req.body.content == null || req.body.content == undefined || req.body.content == "") && (req.body.title == null || req.body.title == undefined || req.body.title == "")) {
    return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  }

  let nt = await note.findOne({
    where: {
      title: req.body.title,
      content: req.body.content,
      note_date: req.body.noteDate,
      user_id: req.params.userId
    },
  });
  if (nt != null) return res.status(200).json({ data: { noteId: nt.id } });
  let request = {
    title: req.body.title,
    content: req.body.content,
    note_date: req.body.noteDate
  }

  let newNote;
  newNote = await note.create(request);
  if (newNote != null) {
    await newNote.setUser(usr).catch(async function (err) {
      let result2 = await handleError(newNote, err);
      if (!result2) error = 1;
      return res.status(502);
    })
  }
  return res.status(200).json({ data: { noteId: newNote.id } });
});

router.put("/:userId/:noteId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null || req.body.noteDate == null || req.body.noteDate == undefined || req.body.noteDate == "") {
    return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  }
  if ((req.body.content == null || req.body.content == undefined || req.body.content == "") && (req.body.title == null || req.body.title == undefined || req.body.title == "")) {
    return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  }
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
      id: req.params.noteId,
      user_id: req.params.userId
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

router.get("/syncNote/:userId/:syncTime/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });

  let syncTime, uNote;
  if (req.params.syncTime == "null" || req.params.syncTime == undefined) {
    uNote = await note.findAll({
      attributes: ['id', 'title', 'content', ['note_date', 'date'], 'updatedAt'],
      where: {
        user_id: req.params.userId,
      }
    })
  }
  else {
    syncTime = new Date(req.params.syncTime);
    let localTime = moment(syncTime.toLocaleString('en-US', { timeZone: 'Asia/Tehran' }))
    uNote = await note.findAll({
      attributes: ['id', 'title', 'content', ['note_date', 'noteDate'], 'updatedAt'],
      where: {
        user_id: req.params.userId,
        updatedAt: {
          [Op.gte]: new Date(localTime),
        }
      },
      orderBy: [['group', 'DESC']],
    })

  }
  return res.status(200).json({ data: uNote });
});

router.post("/syncNote/:userId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null || req.body == undefined) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });

  let uNote = {};
  let result = [];
  for (const element of req.body.data) {
    //delete note
    if (element.state == 2) {
      await note.destroy({
        where: {
          id: element.id
        }
      })
    }
    //update note
    else if (element.state == 1 && element.id != undefined && element.id > 0) {
      let request = {
        title: element.title,
        content: element.content,
        note_date: element.date,
      }

      uNote = await note.findOne({
        where: {
          id: element.id
        },
      });
      if (uNote != null) { await uNote.update(request); }


    }
    //add note
    else if (element.state == 1) {

      uNote = await note.create(
        {
          title: element.title,
          content: element.content,
          note_date: element.date,
        }
      );
      if (uNote != null) {
        await uNote.setUser(usr).catch(async function (err) {
          let result2 = await handleError(uNote, err);
          if (!result2) error = 1;
          return res.status(502);
        })
      }

      result.push({ id: uNote.id, title: uNote.title, content: uNote.title, noteDate: uNote.note_date, updatedAt: uNote.updatedAt });
    }

  }

  return res.status(200).json([{ message: await translate("SUCCESSFUL", req.params.lang) }, { data: result }]);

});

module.exports = router;
