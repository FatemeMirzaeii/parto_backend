const express = require("express");
const router = express();
const auth = require("../middleware/auth");
const { user_profile, user, pregnancy } = require("../models");
const translate = require("../config/translate");
const checkDateWithDateOnly = require("../middleware/checkDateWithDateOnly");

function check(cycleLength, periodLength) {
  if (cycleLength < 10 || cycleLength > 100) return false;
  else if (periodLength < 1 || periodLength > 12) return false;
  return true;
}
router.post("/ordinaryUser/:userId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null) return res.status(404).json({ message: await translate("INFORMATIONNOTFOUND", req.params.lang) });
  const exist = await user_profile.findOne({
    where: {
      user_id: req.params.userId,
    },
  });

  if (exist != null) return res.status(409).json({ message: await translate("EXISTS", req.params.lang) });
  if (!check(req.body.avgCycleLength, req.body.avgPeriodLength)) {
    return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  }
  let request = {
    "birthdate": req.body.birthdate,
    "blood_type": req.body.bloodType,
    "locked": req.body.isLock,
    "avg_cycle_length": req.body.avgCycleLength,
    "avg_period_length": req.body.avgPeriodLength,
    "pregnancy_try": req.body.pregnancyTry,
    "pregnant":0,
    "last_period_date": req.body.lastPeriodDate,
  }
  console.log("request",request);
  if(request.lastPeriodDate==null){
    request.lastPeriodDate=undefined;
  }
  let uProfile = await user_profile.create(request).catch(async function (err) {
    let checkError = await handleError(uProfile, err);
    if (!checkError) {
      return res.status(500).json({ message: await translate("SERVERERROR", req.params.lang) });
    }
  });
  await uProfile.setUser(usr).catch(async function (err) {
    let checkError = await handleError(usr, err);
    if (!checkError) {
      return res.status(500).json({ message: await translate("SERVERERROR", req.params.lang) });
    }
  })
  res.status(200).json({ message: await translate("SUCCESSFUL", req.params.lang) });
});

router.post("/pregnantUser/:userId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null) return res.status(404).json({ message: await translate("INFORMATIONNOTFOUND", req.params.lang) });
  const exist = await user_profile.findOne({
    where: {
      user_id: req.params.userId,
    },
  });

  if (exist != null) return res.status(409).json({ message: await translate("EXISTS", req.params.lang) });
  if (req.body.lastPeriodDate == null) {
    return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  }
  if (!checkDateWithDateOnly(req.body.lastPeriodDate)) {
    return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  }
  let requestProf = {
    "birthdate": req.body.birthdate,
    "last_period_date": req.body.lastPeriodDate,
    "pregnant": 1,
    "pregnancy_try":0
  }
  let uProfile;
  let preg;
  uProfile = await user_profile.create(requestProf);
  await uProfile.setUser(usr).catch(async function (err) {
    let checkError = await handleError(uProfile, err);
    if (!checkError) {
      return res.status(500).json({ message: await translate("SERVERERROR", req.params.lang) });
    }
  })
  
  let requestPreg = {
    "due_date": req.body.dueDate,
    "conception_date": req.body.conceptionDate,
    "state": 1
  }
  if(requestPreg.conceptionDate==null){
    requestPreg.conceptionDate=undefined;
  }
  if(requestPreg.due_date==null){
    requestPreg.due_date=undefined;
  }
  preg = await pregnancy.create(requestPreg);
  await preg.setUser(usr).catch(async function (err) {
    let checkError = await handleError(preg, err);
    if (!checkError) {
      return res.status(500).json({ message: await translate("SERVERERROR", req.params.lang) });
    }
  })

  res.status(200).json({ message: await translate("SUCCESSFUL", req.params.lang) });
});

module.exports = router;
