const express = require("express");
const router = express();
const auth = require("../middleware/auth");
const { user_profile , user ,pregnancy}= require("../models");
const translate = require("../config/translate");
const checkDateWithDateOnly = require("../middleware/checkDateWithDateOnly");

function check(cycleLength,periodLength){
  if(cycleLength<10 ||cycleLength>100) return false;
  else if(periodLength<1 || periodLength>12) return false;
  return true;
}
router.post("/ordinarUser/:userId/:lang",auth, async(req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr==null) return res.status(404).json({ message: await translate("INFORMATIONNOTFOUND", req.params.lang) });
  const exist = await user_profile.findOne({
    where: {
      user_id: req.params.userId,
    },
  });
  
  if (exist!=null) return res.status(409).json({ message: await translate("EXISTS", req.params.lang) });
  if(!check(req.body.avgCycleLength,req.body.avgPeriodLength))
  { 
    return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  }
  let tempBirthdate=req.body.birthdate;
  if(req.body.birthdate==""|| req.body.birthdate==null){
    tempBirthdate="1111-11-11"
  }

  let tempLastPeriod=req.body.lastPeriodDate;
  if(req.body.lastPeriodDate==""){
    tempLastPeriod="1111-11-11"
  }

  const uProfile = await user_profile.create({
    birthdate:new Date(tempBirthdate),
    avg_cycle_length:req.body.avgCycleLength,
    avg_period_length:req.body.avgPeriodLength,
    last_period_date:new Date(tempLastPeriod),
    pregnant:0,
    pregnancy_try: req.body.pregnancyTry

  });
  await uProfile.setUser(usr);
  res.status(200).json({ message: await translate("SUCCESSFUL", req.params.lang) });
});

router.post("/pregnantUser/:userId/:lang",auth, async(req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr==null) return res.status(404).json({ message: await translate("INFORMATIONNOTFOUND", req.params.lang) });
  const exist = await user_profile.findOne({
    where: {
      user_id:req.params.userId,
    },
  });
  
  if (exist!=null) return res.status(409).json({ message: await translate("EXISTS", req.params.lang) });
  if( req.body.lastPeriodDate==null){
    return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  }
  if(!checkDateWithDateOnly(req.body.lastPeriodDate)){
    return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  }

  let uProfile;
  let preg;
  if(req.body.birthdate!=null||req.body.birthdate!=""){
    uProfile = await user_profile.create({
      birthdate:new Date(req.body.birthdate),
      last_period_date:new Date(req.body.lastPeriodDate),
      pregnant:1,
      pregnancy_try: 0

    });
  }
  else{
    uProfile = await user_profile.create({
      last_period_date:new Date(req.body.lastPeriodDate),
      pregnant:1,
      pregnancy_try: 0

    });
  }
  await uProfile.setUser(usr);

  if(req.body.dueDate!=null ){
    preg=await pregnancy.create({
      due_date:new Date(req.body.dueDate),
    });
    await preg.setUser(usr);
  }
  else if(req.body.conceptionDate	!=null){
    if(!checkDateWithDateOnly(req.body.conceptionDate)){
      return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
    }
    preg=await pregnancy.create({
      conception_date:new Date(req.body.conceptionDate),
    });
    await preg.setUser(usr);
  }
   res.status(200).json({ message: await translate("SUCCESSFUL", req.params.lang) });
});

module.exports = router;
