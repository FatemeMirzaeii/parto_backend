const express = require("express");
const { user, pregnancy, user_profile } = require("../models");
const auth = require("../middleware/auth");
const translate = require("../config/translate");
const router = express();
const checkDateWithDateOnly = require("../middleware/checkDateWithDateOnly");
const { Op } = require("sequelize");
const e = require("express");
const Pregnancy = require("../models/Pregnancy");

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

    if (req.body.conceptionDate != null && req.body.conceptionDate != "") {
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
    if (req.body.conceptionDate != null && req.body.conceptionDate != "") {
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
  if (usr.partner_id != null) {
    usrID = usr.partner_id
  }
  else {
    usrID = usr.id
  }
  const userPregnant = await pregnancy.findOne({
    attributes: ['due_date', 'conception_date', 'abortion'],
    where: {
      user_id: usrID,
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
  let uExist = await pregnancy.findOne({
    where: {
      user_id: req.params.userId,
    },
  });
  if (uExist == null) {
    let uExist = await pregnancy.create({
      abortion_date: req.params.abortionDate,
      abortion: 1
    })
    let usr = await user.findByPk(req.params.userId);
    uExist.setUser(usr);
  }
  else {
    await uExist.update({
      abortion_date: req.params.abortionDate,
      abortion: uExist.abortion_date + 1
    })
  }

  return res.status(200).json({ message: await translate("SUCCESSFUL", "fa") });
});

router.get("/syncPregnancyInfo/:userId/:syncTime/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  let syncTime = new Date(req.params.syncTime);

  let pregnantUse = await pregnancy.findAll({
    where: {
      user_id: req.params.userId,
      updatedAt: {
        [Op.gte]: syncTime
      }
      // ,
      // createdAt: {
      //   [Op.gte]: syncTime
      // }
    },
    orderBy: [['group', 'DESC']],
  })

  return res.status(200).json({ data: pregnantUse });
})

router.post("/syncPregnancyInfo/:userId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  let result;
  // console.log("length",req.body.data.length);
  for (i = 0; i < req.body.data.length; i++) {
    console.log("heareeeeee")
    if (req.body.data[i].state == null || req.body.data[i].state == "") {
      // console.log("state nullll")
      result = 400;
      break;
    }
    let pregnantUser = await pregnancy.findOne({
      where: {
        user_id: req.params.userId,
        state: 1
      },
    });
    
    let request = {
      due_date: req.body.data[i].dueDate,
      abortion: req.body.data[i].abortion,
      conception_date: req.body.data[i].conceptionDate || null,
      pregnancy_week: req.body.data[i].pregnancyWeek,
      abortion_date: req.body.data[i].abortionDate || null,
      children_number: req.body.data[i].childrenNumber,
      kick_count: req.body.data[i].kickCount,
      state: req.body.data[i].state
    }
    
    if (pregnantUser==null) {
      if (req.body.data[i].state == 1||req.body.data[i].state == 2 ||req.body.data[i].state == 3) {
        pregnantUser = await pregnancy.create(request);
        await pregnantUser.setUser(usr);
      }
      else {
        // console.log(req.body.data[i].state == 1)
        result = 400;
        break;
      }
    }
    else {
      if(req.body.data[i].state>3){
        result = 400;
        break;
      }
      await pregnantUser.update(request);
    }
  };
// console.log("heareeeeeee")
if (result == 400) {
  return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
}
else { return res.status(200).json({ message: await translate("SUCCESSFUL", req.params.lang) }); }

})


module.exports = router;
