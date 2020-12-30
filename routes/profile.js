const express = require("express");
const router = express();
const auth = require("../middleware/auth");
const checkDate = require("../middleware/checkDateWithDateOnly");
const { user, user_profile } = require("../models");
const translate = require("../config/translate");
const { Op } = require("sequelize");

router.get("/getProfile/:userId/:lang", auth, async (req, res) => {
  console.log("profileeee");
  const uProfile = await user_profile.findOne({
    where: {
      user_id: req.params.userId,
    },
  });
  if (uProfile == null) return res.status(404).json({ message: await translate("INFORMATIONNOTFOUND", req.params.lang) });
  res.status(200).json({ data: uProfile });
});

router.get("/getPeriodInfo/:userId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  let usrID;
  if (usr.partner_id != null) {
    usrID = usr.partner_id
  }
  else {
    usrID = usr.id
  }
  const uProfile = await user_profile.findOne({
    attributes: ['user_id', 'avg_cycle_length', 'avg_period_length', 'pms_length', 'pregnant',
      'pregnancy_try', 'last_period_date', 'ovulation_prediction', 'period_prediction', 'red_days'],
    where: {
      user_id: usrID,
    },
  });
  if (uProfile == null) return res.status(404).json({ message: await translate("INFORMATIONNOTFOUND", req.params.lang) });
  res.status(200).json({ data: uProfile });
});

router.get("/getGeneralInfo/:userId/:lang", auth, async (req, res) => {

  const uProfile = await user_profile.findOne({
    attributes: ['user_id', 'height', 'weight', 'avg_sleeping_hour', 'blood_type', 'locked', 'birthdate'],
    where: {
      user_id: req.params.userId,
    },
  });
  if (uProfile == null) return res.status(404).json({ message: await translate("INFORMATIONNOTFOUND", req.params.lang) });
  res.status(200).json({ data: uProfile });
});

router.put("/editProfile/:userId/:lang", auth, async (req, res) => {
  let userProfil = await user_profile.findOne({ where: { user_id: req.params.userId } });
  if (userProfil == null) return res.status(404).json({ message: await translate("INFORMATIONNOTFOUND", req.params.lang) });

  let tempBirthdate = req.body.birthdate;
  if (req.body.birthdate == "" || req.body.birthdate == null) {
    tempBirthdate = "1111-11-11"
  }

  let tempLastPeriod = req.body.lastPeriodDate;
  if (req.body.lastPeriodDate == "") {
    tempLastPeriod = "1111-11-11"
  }

  await user_profile.update(
    {
      birthdate: new Date(tempBirthdate),
      height: req.body.height,
      weight: req.body.weight,
      avg_sleeping_hour: req.body.sleepingHour,
      blood_type: req.body.bloodType,
      locked: req.body.isLock,
      avg_cycle_length: req.body.cycleLength,
      avg_period_length: req.body.periodLength,
      pms_length: req.body.pmsLength,
      pregnant: req.body.pregnant,
      pregnancy_try: req.body.pregnancyTry,
      last_period_date: new Date(tempLastPeriod),
      ovulation_prediction: req.body.ovulationPred,
      period_prediction: req.body.periodPred,
      red_days: req.body.redDays

    }, {
    where: {
      user_id: req.params.userId
    }
  });
  res.status(200).json({ message: await translate("SUCCESSFUL", "fa") });
});

router.put("/editPeriodInfo/:userId/:lang", auth, async (req, res) => {
  let userProfil = await user_profile.findOne({ where: { user_id: req.params.userId } });
  if (userProfil == null) return res.status(404).json({ message: await translate("INFORMATIONNOTFOUND", req.params.lang) });
  let tempLastPeriod = req.body.lastPeriodDate;
  if (req.body.lastPeriodDate == null || req.body.lastPeriodDate == "") {
    tempLastPeriod = "1111-11-11";
  }
  await user_profile.update(
    {
      avg_cycle_length: req.body.cycleLength,
      avg_period_length: req.body.periodLength,
      pms_length: req.body.pmsLength,
      pregnant: req.body.pregnant,
      pregnancy_try: req.body.pregnancyTry,
      last_period_date: new Date(tempLastPeriod),
      ovulation_prediction: req.body.ovulationPred,
      period_prediction: req.body.periodPred,
      red_days: req.body.redDays
    }, {
    where: {
      user_id: req.params.userId
    }
  });

  res.status(200).json({ message: await translate("SUCCESSFUL", "fa") });
});

router.put("/editGeneralInfo/:userId/:lang", auth, async (req, res) => {
  let userProfil = await user_profile.findOne({ where: { user_id: req.params.userId } });
  if (userProfil == null) return res.status(404).json({ message: await translate("INFORMATIONNOTFOUND", req.params.lang) });

  let tempBirthdate = req.body.birthdate;
  if (req.body.birthdate == "" || req.body.birthdate == null) {
    tempBirthdate = "1111-11-11"
  }

  await user_profile.update(
    {
      birthdate: new Date(tempBirthdate),
      height: req.body.height,
      weight: req.body.weight,
      avg_sleeping_hour: req.body.sleepingHour,
      blood_type: req.body.bloodType,
      locked: req.body.isLock
    }, {
    where: {
      user_id: req.params.userId
    }
  });
  res.status(200).json({ message: await translate("SUCCESSFUL", "fa") });
});

router.delete("/deleteProfile/:userId/:lang", auth, async (req, res) => {
  const uProfile = await user_profile.findOne({
    where: {
      user_id: req.params.userId,
    },
  });
  if (uProfile == null) return res.status(404).json({ message: await translate("INFORMATIONNOTFOUND", req.params.lang) });

  await user_profile.destroy({
    where: {
      user_id: req.params.userId,
    }
  });

  res.status(200).json({ message: await translate("SUCCESSFUL", "fa") });
});

router.post("/addProfile/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });

  let userProf = await user_profile.create(
    {
      birthdate: new Date(req.body.birthdate),
      height: req.body.height,
      weight: req.body.weight,
      avg_sleeping_hour: req.body.sleepingHour,
      blood_type: req.body.bloodType,
      locked: req.body.isLock,

    });
  userProf.setUser(usr);
  res.status(200).json({ message: await translate("SUCCESSFUL", "fa") });
});

router.get("/pregnancyMode/:userId/:lang", auth, async (req, res) => {
  const uPregnantProfile = await user_profile.findOne({
    attributes: ['pregnant'],
    where: {
      user_id: req.params.userId,
    },
  });
  if (uPregnantProfile == null) return res.status(404).json({ message: await translate("INFORMATIONNOTFOUND", req.params.lang) });
  return res.status(200).json({ data: uPregnantProfile });
});

router.get("/getUserStatus/:userId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  let usrID;
  if (usr.partner_id != null) {
    usrID = usr.partner_id
  }
  else {
    usrID = usr.id
  }
  const uPregnantProfile = await user_profile.findOne({
    attributes: ['pregnant', 'pregnancy_try'],
    where: {
      user_id: usrID,
    },
  });
  if (uPregnantProfile == null) return res.status(404).json({ message: await translate("INFORMATIONNOTFOUND", req.params.lang) });
  res.status(200).json({ data: uPregnantProfile });
});

router.put("/updateUserStatus/:userId/:lang", auth, async (req, res) => {
  const uPregnantProfile = await user_profile.findOne({
    where: {
      user_id: req.params.userId,
    },
  });
  if (uPregnantProfile == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  console.log("pregnant", req.body.pregnant);
  if ((req.body.pregnant == 0 || req.body.pregnant == 1) && (req.body.pregnancyTry == 0 || req.body.pregnancyTry == 1)) {
    await user_profile.update({ pregnant: req.body.pregnant, pregnancy_try: req.body.pregnancyTry },
      {
        where: {
          user_id: req.params.userId,
        },
      }
    );
    return res.status(200).json({ message: await translate("SUCCESSFUL", req.params.lang) });
  }
  else return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
});

router.get("/lockStatus/:userId/:lang", auth, async (req, res) => {
  const useLock = await user_profile.findOne({
    attributes: ['locked'],
    where: {
      user_id: req.params.userId,
    },
  });
  if (useLock == null) return res.status(404).json({ message: await translate("INFORMATIONNOTFOUND", req.params.lang) });
  return res.status(200).json({ data: useLock });
});

router.put("/setLock/:userId/:lang", auth, async (req, res) => {
  if (req.body.isLock == 0 || req.body.isLock == 1) {
    const useLock = await user_profile.update({ locked: req.body.isLock },
      {
        where: {
          user_id: req.params.userId,
        },
      });
    if (useLock == null) {
      return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
    }
    return res.status(200).json({ message: await translate("SUCCESSFUL", req.params.lang) });
  }
  else return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
});

router.post("/setLastSyncTime/:userId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  if (req.body.lastSyncTime == null || req.body.lastSyncTime == "") {
    return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  }
  if (!checkDate(req.body.lastSyncTime)) {
    return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  }
  const setLastSyncTime = await user_profile.update({ last_sync_time: req.body.lastSyncTime },
    {
      where: {
        user_id: req.params.userId,
      },
    });
  if (setLastSyncTime == null) {
    return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  }
  return res.status(200).json({ message: await translate("SUCCESSFUL", req.params.lang) });

})

router.get("/syncProfile/:userId/:syncTime/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });

  let usrID;
  if (usr.partner_id != null) {
    usrID = usr.partner_id
  }
  else {
    usrID = usr.id
  }

  let syncTime;
  if (req.params.syncTime == "null") {
    syncTime = await pregnancy.findOne({
      attributes: ['updatedAt'],
      where: {
        user_id: usrID
      }
    })
  }
  else {
    syncTime = new Date(req.params.syncTime);
  }
  let usrProfile = await user_profile.findAll({
    where: {
      user_id: usrID,
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

  return res.status(200).json({ data: usrProfile });
})

router.post("/syncProfile/:userId/:lang", auth, async (req, res) => {

  let usr = await user.findByPk(req.params.userId);
  if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  let uProfile = await user_profile.findOne({
    where: {
      user_id: req.params.userId,
    },
  });

  if (req.body.data.birthdate == null && req.body.data.height == null && req.body.data.weight == null && req.body.data.avg_sleeping_hour == null &&
    req.body.data.blood_type == null && req.body.data.isLock == null && req.body.data.avg_cycle_length == null && req.body.data.avg_period_length == null &&
    req.body.data.pms_length == null && req.body.data.pregnant == null && req.body.data.pregnancy_try == null && req.body.data.last_period_date == null &&
    req.body.data.ovulation_prediction == null && req.body.data.period_prediction == null && req.body.data.red_days == null) {
    return res.status(200).json({ message: await translate("SUCCESSFUL", req.params.lang) });
  }
  else {
    if (uProfile != null) {
      await uProfile.update(req.body.data);
    }
    else {
      uProfile = await user_profile.create(req.body.data);
      await uProfile.setUser(usr);
    }
    return res.status(200).json({ message: await translate("SUCCESSFUL", req.params.lang) });
  }

})

module.exports = router;