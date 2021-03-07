const express = require("express");
const router = express();
const auth = require("../middleware/auth");
const checkDate = require("../middleware/checkDateWithDateOnly");
const { user, user_profile } = require("../models");
const translate = require("../config/translate");
const { Op } = require("sequelize");
const fs = require("fs");
const handleError = require("../middleware/handleMysqlError");
const moment = require("moment");

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
  let uProfile = await user_profile.findOne({
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

  let request = {
    "birthdate": req.body.birthdate,
    "height": req.body.height,
    "weight": req.body.weight,
    "avg_sleeping_hour": req.body.sleepingHour,
    "blood_type": req.body.bloodType,
    "locked": req.body.isLock,
    "avg_cycle_length": req.body.cycleLength,
    "avg_period_length": req.body.periodLength,
    "pms_length": req.body.pmsLength,
    "pregnant": req.body.pregnant,
    "pregnancy_try": req.body.pregnancyTry,
    "last_period_date": req.body.lastPeriodDate,
    "ovulation_prediction": req.body.ovulationPred,
    "period_prediction": req.body.periodPred,
    "red_days": req.body.redDays
  }
  if (moment(request.birthdate, "YYYY-MM-DD", true).isValid() == false) {
    request.birthdate = undefined;
  }
  if (moment(request.last_period_date, "YYYY-MM-DD", true).isValid() == false) {
    request.last_period_date = undefined;
  }
  await user_profile.update(request,
    {
      where: {
        user_id: req.params.userId
      }
    });
  res.status(200).json({ message: await translate("SUCCESSFUL", "fa") });
});

router.put("/editPeriodInfo/:userId/:lang", auth, async (req, res) => {
  let userProfil = await user_profile.findOne({ where: { user_id: req.params.userId } });
  if (userProfil == null) return res.status(404).json({ message: await translate("INFORMATIONNOTFOUND", req.params.lang) });
  let request = {
    "avg_cycle_length": req.body.cycleLength,
    "avg_period_length": req.body.periodLength,
    "pms_length": req.body.pmsLength,
    "pregnant": req.body.pregnant,
    "pregnancy_try": req.body.pregnancyTry,
    "last_period_date": req.body.lastPeriodDate,
    "ovulation_prediction": req.body.ovulationPred,
    "period_prediction": req.body.periodPred,
    "red_days": req.body.redDays
  }
  if (moment(request.last_period_date, "YYYY-MM-DD", true).isValid() == false) {
    request.last_period_date = undefined;
  }
  await user_profile.update(request,
    {
      where: {
        user_id: req.params.userId
      }
    });

  res.status(200).json({ message: await translate("SUCCESSFUL", "fa") });
});

router.put("/editGeneralInfo/:userId/:lang", auth, async (req, res) => {
  let userProfil = await user_profile.findOne({ where: { user_id: req.params.userId } });
  if (userProfil == null) return res.status(404).json({ message: await translate("INFORMATIONNOTFOUND", req.params.lang) });

  let request = {
    "birthdate": req.body.birthdate,
    "height": req.body.height,
    "weight": req.body.weight,
    "avg_sleeping_hour": req.body.sleepingHour,
    "blood_type": req.body.bloodType,
    "locked": req.body.isLock
  }
  if (moment(request.birthdate, "YYYY-MM-DD", true).isValid() == false) {
    request.birthdate = undefined;
  }

  await user_profile.update(request,
    {
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

router.post("/addProfile/:userId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  let request = {
    "birthdate": req.body.birthdate,
    "height": req.body.height,
    "weight": req.body.weight,
    "avg_sleeping_hour": req.body.sleepingHour,
    "blood_type": req.body.bloodType,
    "locked": req.body.isLock,
  }
  if (moment(request.birthdate, "YYYY-MM-DD", true).isValid() == false) {
    request.birthdate = undefined;
  }

  let userProf = await user_profile.create(request);
  userProf.setUser(usr).catch(async function (err) {
    let checkError = await handleError(usr, err);
    if (!checkError) {
      return res.status(500).json({ message: await translate("SERVERERROR", req.params.lang) });
    }
  })

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
  const uProfile = await user_profile.findOne({
    where: {
      user_id: req.params.userId,
    },
  });
  if (uProfile == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  if (req.body.isLock == 0 || req.body.isLock == 1) {
    await user_profile.update({ locked: req.body.isLock },
      {
        where: {
          user_id: req.params.userId,
        },
      });

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
  const uProfile = await user_profile.findOne({
    where: {
      user_id: req.params.userId,
    },
  });
  if (uProfile == null) {
    await user_profile.create({ last_sync_time: req.body.lastSyncTime },
      {
        where: {
          user_id: req.params.userId,
        },
      });
  }
  else {
    await user_profile.update({ last_sync_time: req.body.lastSyncTime },
      {
        where: {
          user_id: req.params.userId,
        },
      });
  }
  return res.status(200).json({ message: await translate("SUCCESSFUL", req.params.lang) });

})

router.get("/syncProfile/:userId/:syncTime/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });

  let usrID = req.params.userId;
  if (usr.partner_id != null) {
    usrID = usr.partner_id
  }

  let userProf = await user_profile.findOne({
    where: {
      user_id: usrID
    }
  })
  if (userProf == null) return res.status(200).json({ data: userProf });

  let syncTime, usrProfile;
  if (req.params.syncTime == "null") {
    usrProfile = await user_profile.findAll({
      where: {
        user_id: usrID
      }
    })
  }
  else {
    syncTime = new Date(req.params.syncTime);
    let milliseconds = Date.parse(syncTime);
    milliseconds = milliseconds - (((3 * 60) + 30) * 60 * 1000);
    usrProfile = await user_profile.findAll({
      where: {
        user_id: usrID,
        updatedAt: {
          [Op.gte]: new Date(milliseconds),
        }
      },
      orderBy: [['group', 'DESC']],
    })
  }


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

  console.log("data", req.body.data[0]);
  if ((req.body.data).length == 0) {
    return res.status(200).json({ message: await translate("SUCCESSFUL", req.params.lang) });
  }
  else {
    let request = {
      "last_sync_time": req.body.data[0].last_sync_time,
      "blood_type": req.body.data[0].blood_type,
      "period_perdiction": req.body.data[0].period_prediction,
      "ovulation_perdiction": req.body.data[0].ovulation_prediction,
      "locked": req.body.data[0].isLock,
      "height": req.body.data[0].height,
      "pregnancy_try": req.body.data[0].pregnancy_try,
      "weight": req.body.data[0].weight,
      "avg_period_length": req.body.data[0].avg_period_length,
      "last_period_date": req.body.data[0].last_period_date,
      "pms_length": req.body.data[0].pms_length,
      "avg_cycle_length": req.body.data[0].avg_cycle_length,
      "birthdate": req.body.data[0].birthdate,
      "pregnant": req.body.data[0].pregnant,
      "avg_sleeping_hour": req.body.data[0].avg_sleeping_hour
    }
    if (moment(request.birthdate, "YYYY-MM-DD", true).isValid() == false) {
      request.birthdate = undefined;
    }
    if (moment(request.last_period_date, "YYYY-MM-DD", true).isValid() == false) {
      request.last_period_date = undefined;
    }
    if (moment(request.last_sync_time, "YYYY-MM-DD", true).isValid() == false) {
      request.last_sync_time = undefined;
    }
    if (uProfile != null) {
      await uProfile.update(request);
    }
    else {
      uProfile = await user_profile.create(request);
      await uProfile.setUser(usr).catch(async function (err) {
        let checkError = await handleError(usr, err);
        if (!checkError) {
          return res.status(500).json({ message: await translate("SERVERERROR", req.params.lang) });
        }
      })
    }
    return res.status(200).json({ message: await translate("SUCCESSFUL", req.params.lang) });
  }

})

router.post("/:userId/image/:lang", auth, async (req, res) => {

  let usr = await user.findByPk(req.params.userId);
  if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });

  if (!req.files)
    return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });

  let uProfile = await user_profile.findOne({
    where: {
      user_id: req.params.userId,
    },
  });

  if (uProfile != null && uProfile.image != null) {
    fs.unlinkSync('images/' + uProfile.image);
  }

  let file = req.files.image;
  let userImage = 'image-' + req.params.userId + '-' + file.name;

  if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/gif" || file.mimetype == "image/svg+xml") {
    file.mv('images/' + 'image-' + req.params.userId + '-' + file.name, async function (err) {
      if (err)
        return res.status(500).send(err);
      else {
        let image = { image: userImage };
        if (uProfile != null) {
          await uProfile.update(image);
        }
        else {
          uProfile = await user_profile.create(image);
          await uProfile.setUser(usr);
        }
      }
    });
    return res.status(200).json({ message: await translate("SUCCESSFUL", req.params.lang) });
  }
  else {
    return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  }

});

router.get("/:userId/image/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  let uProfile = await user_profile.findOne({
    where: {
      user_id: req.params.userId,
    },
  });
  if (uProfile == null || uProfile.image == null) return res.status(404).json({ message: await translate("INFORMATIONNOTFOUND", req.params.lang) });
  var mime = {
    gif: 'image/gif',
    jpg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    jpeg: 'image/jpeg',
  }

  var type = mime[(uProfile.image.split("."))[(uProfile.image.split(".")).length - 1]] || 'text/plain';

  var s = fs.createReadStream('images/' + uProfile.image);
  s.on('open', function () {
    res.set('Content-Type', type);
    s.pipe(res);
  });
  s.on('error', function () {
    res.set('Content-Type', 'text/plain');
    return res.status(404).json({ message: translate("INFORMATIONNOTFOUND", req.params.lang) });
  });
})

router.delete("/:userId/image/:lang", auth, async (req, res) => {

  let usr = await user.findByPk(req.params.userId);
  if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });

  let uProfile = await user_profile.findOne({
    where: {
      user_id: req.params.userId,
    },
  });

  if (uProfile != null && uProfile.image != null) {
    fs.unlinkSync('images/' + uProfile.image);
    await uProfile.update({ image: null });
  }
  return res.status(200).json({ message: await translate("SUCCESSFUL", req.params.lang) });

});


module.exports = router;