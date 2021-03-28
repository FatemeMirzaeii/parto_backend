const express = require("express");
const router = express();
const auth = require("../middleware/auth");
const { transaction, ledger, credit,services } = require("../models");
const translate = require("../config/translate");


router.post("v1/payment/:userId/:lang", auth, async (req, res) => {
    https://api.zarinpal.com/pg/v4/payment/request.json
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



module.exports = router;
