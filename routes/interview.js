const express = require("express");
const router = express();
const auth = require("../middleware/auth");
const { user_profile , user }= require("../models");
const translate = require("../config/translate");

router.post("/:lang",auth, async(req, res) => {
  const usr = await user.findOne({
    where: {
      id: req.body.userId,
    },
  });
  if (usr==null) return res.status(400).json({ message: await translate("INFORMATIONNOTFOUND", req.params.lang) });
  const exist = await user_profile.findOne({
    where: {
      user_id: req.body.userId,
    },
  });
  
  if (exist!=null) return res.status(400).json({ message: await translate("EXISTS", req.params.lang) });
  
  const uProfile = await user_profile.create({
    birthdate:new Date(req.body.birthdate),
    avg_cycle_length:req.body.avgCycleLength,
    avg_period_length:req.body.avgPeriodLength,
    avg_sleeping_hour:req.body.avgSleepingHour,
    pms_length:req.body.pmsLength,
    height:req.body.height,
    weight:req.body.weight,
    pregnant:req.body.pregnant,
    pregnancy_try:req.body.pregnancyTry,
    use_lock:req.body.useLock,
    zygosis_date:req.body.zygosisDate

  });
  await uProfile.setUser(usr);
  res.status(200).json({data:{id:uProfile.id}});
});

module.exports = router;
