const express = require("express");
const { user, pregnancy, user_profile } = require("../../models");
const auth = require("../../middleware/auth");
const translate = require("../../config/translate");
const router = express();
// const checkDateWithDateOnly = require("../middleware/checkDateWithDateOnly");
const { Op } = require("sequelize");

router.post("/savePregnancyData/:userId/:lang", auth, async (req, res) => {
  const uPregnantProfile = await user_profile.findOne({
    attributes: ['pregnant'],
    where: {
      user_id: req.params.userId,
    },
  });

  if (uPregnantProfile != null && uPregnantProfile.pregnant == 0) {
    return res.status(409).json({ message: await translate("CONTRADICTION", req.params.lang) });
  }

  if (req.body.dueDate == null && req.body.abortion == null && req.body.conceptionDate == null && req.body.pregnancyWeek == null
    && req.body.abortionDate == null && req.body.childrenNumber == null && req.body.kickCount == null) {
    return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  }
  let request = {
    due_date: req.body.dueDate,
    abortion: req.body.abortion,
    conception_date: req.body.conceptionDate,
    pregnancy_week: req.body.pregnancyWeek,
    abortion_date: req.body.abortionDate,
    children_number: req.body.childrenNumber,
    kick_count: req.body.kickCount,
    state: req.body.state
  }

  let uExist = await pregnancy.findOne({
    where: {
      user_id: req.params.userId,
      state: 1
    },
  });
  let usr = await user.findByPk(req.params.userId);

  if (uExist == null) {
    if (req.body.state == 2 || req.body.state == 3) {
      return res.status(404).json({ message: await translate("INFORMATIONNOTFOUND", req.params.lang) });
    }
    else if (req.body.state == 1) {
      uExist = await pregnancy.create(request);
      await uExist.setUser(usr);
    }
    else {
      return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
    }
  }
  else {
    if (req.body.state > 3) {
      return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
    }
    await uExist.update(request);
  }

  return res.status(200).json({ message: await translate("SUCCESSFUL", req.params.lang) });
});

router.get("/getPregnancyData/:userId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  let usrID;
  if (usr.partner_id != null) {
    usrID = usr.partner_id
  }
  else {
    usrID = usr.id
  }
  const userPregnant = await pregnancy.findOne({
    attributes: ['due_date', 'conception_date', 'abortion', 'pregnancy_week', 'abortion_date', 'children_number', 'kick_count', 'state'],
    where: {
      user_id: usrID,
    },
  });
  if (userPregnant == null) {
    return res.status(404).json({ message: await translate("INFORMATIONNOTFOUND", req.params.lang) });
  }
  return res.status(200).json({ data: userPregnant });
});

router.post("/endPregnancy/:userId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null || req.body.state == null || req.body.state == "" || req.body.state == 1 || req.body.state > 3) {
    return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  }

  let uPregnant = await pregnancy.findOne({
    where: {
      user_id: req.params.userId,
      state: 1
    },
  });

  let request = {
    due_date: req.body.dueDate,
    abortion_date: req.body.abortionDate,
    state: req.body.state
  }

  if (uPregnant != null) {
    if (req.body.state == 2) {
      await uPregnant.update(request);
    }
    else if (req.body.state == 3) {
      let updateObj;
      if (req.body.dueDate != null) {
        let child = { children_number: uPregnant.children_number + 1 || 1 }
        updateObj = Object.assign(request, child);
      }
      else if (req.body.abortionDate != null) {
        let abortion = { abortion: uPregnant.abortion + 1 || 1 }
        updateObj = Object.assign(request, abortion);
      }
      await uPregnant.update(updateObj);

    }
  }
  else {
    return res.status(404).json({ message: await translate("INFORMATIONNOTFOUND", req.params.lang) });
  }
  return res.status(200).json({ message: await translate("SUCCESSFUL", req.params.lang) });
})

router.post("/setDueDate/:userId/:lang", auth, async (req, res) => {
  const uPregnantProfile = await user_profile.findOne({
    attributes: ['pregnant'],
    where: {
      user_id: req.params.userId,
    },
  });

  if (uPregnantProfile != null && uPregnantProfile.pregnant == 0) {
    return res.status(409).json({ message: await translate("CONTRADICTION", req.params.lang) });
  }
  const uExist = await pregnancy.findOne({
    where: {
      user_id: req.params.userId,
      state: 1
    },
  });
  if (uExist == null) {
    let uPregnant = await pregnancy.create({
      due_date: req.body.dueDate,
      state: 1
    })
    let usr = await user.findByPk(req.params.userId);
    uPregnant.setUser(usr);
  }
  else {
    await uExist.update({
      due_date: req.body.dueDate
    })
  }

  return res.status(200).json({ message: await translate("SUCCESSFUL", "fa") });
});

router.post("/setAbortionDate/:userId/:lang", auth, async (req, res) => {
  const uPregnantProfile = await user_profile.findOne({
    attributes: ['pregnant'],
    where: {
      user_id: req.params.userId,
    },
  });

  if (uPregnantProfile != null && uPregnantProfile.pregnant == 0) {
    return res.status(409).json({ message: await translate("CONTRADICTION", req.params.lang) });
  }
  let uExist = await pregnancy.findOne({
    where: {
      user_id: req.params.userId,
      state: 1
    },
  });
  if (uExist == null) {
    let uExist = await pregnancy.create({
      abortion_date: req.body.abortionDate,
      abortion: 1,
      state: 1
    })
    let usr = await user.findByPk(req.params.userId);
    uExist.setUser(usr);
  }
  else {
    await uExist.update({
      abortion_date: req.body.abortionDate,
      abortion: uExist.abortion + 1,
      state: 1
    })
  }

  return res.status(200).json({ message: await translate("SUCCESSFUL", "fa") });
});

router.get("/syncPregnancyInfo/:userId/:syncTime/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });

  let usrID;
  if (usr.partner_id != null) {
    usrID = usr.partner_id
  }
  else {
    usrID = usr.id
  }
  let userPregnancy = await pregnancy.findOne({
    where: {
      user_id: usrID,
   }
  })
  if (userPregnancy == null) return res.status(200).json({ data: userPregnancy });
  let syncTime, pregnantUsre;

  if (req.params.syncTime == "null") {
    pregnantUsre = await pregnancy.findAll({
      where: {
        user_id: usrID,
        state:{[Op.in]:[1,3]}
      }
    })
  }
  else {
    syncTime = new Date(req.params.syncTime);
    let milliseconds = Date.parse(syncTime);
    milliseconds = milliseconds - (((4 * 60) + 30) * 60 * 1000);

    pregnantUsre = await pregnancy.findAll({
      where: {
        user_id: usrID,
        state:{[Op.in]:[1,3]},
        updatedAt: {
          [Op.gte]: new Date(milliseconds)
        }
      },
      orderBy: [['group', 'DESC']],
    })
  }
  return res.status(200).json({ data: pregnantUsre });
})

router.post("/syncPregnancyInfo/:userId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null || req.body == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  let result;

  if ((req.body.data).length == 0) {
    return res.status(200).json({ message: await translate("SUCCESSFUL", req.params.lang) });
  }
  for (i = 0; i < req.body.data.length; i++) {
    if (req.body.data[i].state != null && req.body.data[i].state != "") {

      let pregnantUser = await pregnancy.findOne({
        where: {
          user_id: req.params.userId,
          state: 1
        },
      });

      let request = {
        "due_date": req.body.data[i].due_date,
        "abortion": req.body.data[i].abortion,
        "conception_date": req.body.data[i].conception_date,
        "pregnancy_week": req.body.data[i].pregnancy_week,
        "abortion_date": req.body.data[i].abortion_date,
        "children_number": req.body.data[i].children_number,
        "kick_count": req.body.data[i].kick_count,
        "state": req.body.data[i].state
      }
      if (pregnantUser == null) {
        if (request.state == 1) {
          pregnantUser = await pregnancy.create(request);
          await pregnantUser.setUser(usr);
        }
      }
      else{
        if (request.state == 2 || request.state == 3) {
          await pregnantUser.update(request);
        }
      }
    }
  }
  return res.status(200).json({ message: await translate("SUCCESSFUL", req.params.lang) });

})


module.exports = router;
