const express = require("express");
const { user, pregnancy, user_profile } = require("../models");
const auth = require("../middleware/auth");
const translate = require("../config/translate");
const router = express();
const checkDateWithDateOnly = require("../middleware/checkDateWithDateOnly");

router.post("/savePregnancyData/:userId/:lang", auth, async (req, res) => {
  const uPregnantProfile = await user_profile.findOne({
    attributes: ['pregnant'],
    where: {
      user_id: req.params.userId,
    },
  });
  if (uPregnantProfile == null) {
    return res.status(404).json({ message: await translate("INFORMATIONNOTFOUND", req.params.lang) });
  }
  if (uPregnantProfile.pregnant == 0) {
    return res.status(409).json({ message: await translate("CONTRADICTION", req.params.lang) });
  } if (req.body.dueDate == null || checkDateWithDateOnly(req.body.dueDate) == true) {
    return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  }

  const uExist = await pregnancy.findOne({
    where: {
      user_id: req.params.userId,
    },
  });
  if (uExist == null) {
    let usr = await user.findOne({
      where: {
        id: req.params.userId,
      },
    });
    let uPregnant = await pregnancy.create({
      due_date: req.body.dueDate,
      abortion: req.body.abortion
    })
    await uPregnant.setUser(usr);

    if (req.body.conceptionDate != null && req.body.conceptionDate !="") {
      await pregnancy.update({
        conception_date: req.body.conceptionDate
      }, {
        where: {
          user_id: req.params.userId,
        }
      });
    }
  }
  else {
    await pregnancy.update({
      due_date: req.body.dueDate,
      abortion: req.body.abortion
    }, {
      where: {
        user_id: req.params.userId,
      }
    })
    if (req.body.conceptionDate != null && req.body.conceptionDate !="") {
      await pregnancy.update({
        conception_date: req.body.conceptionDate
      }, {
        where: {
          user_id: req.params.userId,
        }
      });
    }
  }

  return res.status(200).json({ message: await translate("SUCCESSFUL", "fa") });
});

router.get("/getPregnancyData/:userId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  let usrID;
  if(usr.partner_id!=null){
    usrID=usr.partner_id
  }
  else{
    usrID=usr.id
  }
  const userPregnant = await pregnancy.findOne({
    attributes: ['due_date', 'conception_date', 'abortion'],
    where: {
      user_id:usrID,
    },
  });
  if (userPregnant == null) {
    return res.status(404).json({ message: await translate("INFORMATIONNOTFOUND", req.params.lang) });
  }
  return res.status(200).json({ data: userPregnant });
});

router.post("/setPregnancyEnd/:userId/:dueDate/:lang", auth, async (req, res) => {
  const uPregnantProfile = await user_profile.findOne({
    attributes: ['pregnant'],
    where: {
      user_id: req.params.userId,
    },
  });
  if (uPregnantProfile == null) {
    return res.status(404).json({ message: await translate("INFORMATIONNOTFOUND", req.params.lang) });
  }
  if (uPregnantProfile.pregnant == 0) {
    return res.status(409).json({ message: await translate("CONTRADICTION", req.params.lang) });
  }
  const uExist = await pregnancy.findOne({
    where: {
      user_id: req.params.userId,
    },
  });
  if (uExist == null) {
    let uPregnant = await pregnancy.create({
      due_date: req.params.dueDate
    })
    let usr = await user.findByPk(req.params.userId);
    uPregnant.setUser(usr);
  }
  else {
    await pregnancy.update({
      due_date: req.params.dueDate
    }, {
      where: {
        user_id: req.params.userId,
      }
    })
  }

  return res.status(200).json({ message: await translate("SUCCESSFUL", "fa") });
});

router.post("/setAbortionDate/:userId/:abortionDate/:lang", auth, async (req, res) => {
  const uPregnantProfile = await user_profile.findOne({
    attributes: ['pregnant'],
    where: {
      user_id: req.params.userId,
    },
  });
  if (uPregnantProfile == null) {
    return res.status(404).json({ message: await translate("INFORMATIONNOTFOUND", req.params.lang) });
  }
  if (uPregnantProfile.pregnant == 0) {
    return res.status(409).json({ message: await translate("CONTRADICTION", req.params.lang) });
  }
  const uExist = await pregnancy.findOne({
    where: {
      user_id: req.params.userId,
    },
  });
  if (uExist == null) {
    let uPregnant = await pregnancy.create({
      abortion_date: req.params.abortionDate,
      abortion:1
    })
    let usr = await user.findByPk(req.params.userId);
    uPregnant.setUser(usr);
  }
  else {
    await pregnancy.update({
      abortion_date: req.params.abortionDate,
      abortion:uExist.abortion_date+1
    }, {
      where: {
        user_id: req.params.userId,
      }
    })
  }

  return res.status(200).json({ message: await translate("SUCCESSFUL", "fa") });
});



module.exports = router;
