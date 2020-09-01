const express = require("express");
const router = express();
const auth = require("../middleware/auth");
const { user_profile , user ,pregnancy}= require("../models");
const translate = require("../config/translate");

function check(birthdate,cycleLength,periodLength,periodDate){
  if(cycleLength<10 ||cycleLength>100) return false;
  else if(periodLength<1 || periodLength>12) return false;
  return true;
}
router.post("/ordinarUser/:lang",auth, async(req, res) => {
  const usr = await user.findOne({
    where: {
      id: req.body.userId,
    },
  });
  if (usr==null) return res.status(404).json({ message: await translate("INFORMATIONNOTFOUND", req.params.lang) });
  const exist = await user_profile.findOne({
    where: {
      user_id: req.body.userId,
    },
  });
  
  if (exist!=null) return res.status(409).json({ message: await translate("EXISTS", req.params.lang) });
  if(!check(req.body.birthdate,req.body.avgCycleLength,req.body.avgPeriodLength,req.body.lastPeriodDate))
  { 
    return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  }
  const uProfile = await user_profile.create({
    birthdate:new Date(req.body.birthdate),
    avg_cycle_length:req.body.avgCycleLength,
    avg_period_length:req.body.avgPeriodLength,
    last_period_date:req.body.lastPeriodDate,
    pregnant:0

  });
  await uProfile.setUser(usr);
  res.status(200).json({ message: await translate("SUCCESSFUL", req.params.lang) });
});

router.post("/pregnentUser/:lang",auth, async(req, res) => {
  const usr = await user.findOne({
    where: {
      id: req.body.userId,
    },
  });
  if (usr==null) return res.status(404).json({ message: await translate("INFORMATIONNOTFOUND", req.params.lang) });
  const exist = await user_profile.findOne({
    where: {
      user_id: req.body.userId,
    },
  });
  
  if (exist!=null) return res.status(409).json({ message: await translate("EXISTS", req.params.lang) });
  
  let uProfile;
  let preg;
  if(req.body.pregnancyWeek!=null){
    uProfile = await user_profile.create({
      birthdate:new Date(req.body.birthdate),
      pregnant:1

    });
    await uProfile.setUser(usr);
    preg=await pregnancy.create({
      pregnancy_week:req.body.pregnancyWeek
    });
    await preg.setUser(usr);
  }
  else{
    if(req.body.dueDate==null && req.body.zygosisDate==null && req.body.lastPeriodDate==null)
    { 
      return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
    }
    else if(req.body.lastPeriodDate!=null){
      uProfile = await user_profile.create({
        birthdate:new Date(req.body.birthdate),
        last_period_date:req.body.lastPeriodDate,
        pregnant:1

      });
      await uProfile.setUser(usr);
      preg=await pregnancy.create({
        pregnancy_week:req.body.pregnancyWeek
      });
      await preg.setUser(usr);
    }
    else if(req.body.dueDate!=null ){
      preg=await pregnancy.create({
        due_date:new Date(req.body.dueDate),
        pregnancy_week:req.body.pregnancyWeek
      });
      await preg.setUser(usr);
    }
    else if(req.body.zygosisDate!=null){
      preg=await pregnancy.create({
        zygosis_date:new Date(req.body.zygosisDate),
        pregnancy_week:req.body.pregnancyWeek
      });
      await preg.setUser(usr);
    }
  }
  res.status(200).json({ message: await translate("SUCCESSFUL", req.params.lang) });
});

module.exports = router;
