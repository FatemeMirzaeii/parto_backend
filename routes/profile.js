const express = require("express");
const router = express();
const auth = require("../middleware/auth");
const {user, user_profile }= require("../models");
const translate = require("../config/translate");

router.get("/getProfile/:userId/:lang",auth, async(req, res) => {
  
    const uProfile = await user_profile.findOne({
      where: {
        user_id: req.params.userId,
      },
    });
    if(uProfile==null) return res.status(404).json({ message: await translate("INFORMATIONNOTFOUND", req.params.lang) });
    res.status(200).json({data:uProfile});
});

router.get("/getPeriodInfo/:userId/:lang",auth, async(req, res) => {
  
  const uProfile = await user_profile.findOne({
    attributes: ['user_id','avg_cycle_length','avg_period_length','pms_length','pregnant',
    'pregnancy_try','last_period_date','ovulation_prediction','period_prediction','red_days'],
    where: {
      user_id: req.params.userId,
    },
  });
  if(uProfile==null) return res.status(404).json({ message: await translate("INFORMATIONNOTFOUND", req.params.lang) });
  res.status(200).json({data:uProfile});
});

router.get("/getGeneralInfo/:userId/:lang",auth, async(req, res) => {
  
  const uProfile = await user_profile.findOne({
    attributes: ['user_id','height','weight','avg_sleeping_hour','blood_type','locked','birthdate'],
    where: {
      user_id: req.params.userId,
    },
  });
  if(uProfile==null) return res.status(404).json({ message: await translate("INFORMATIONNOTFOUND", req.params.lang) });
  res.status(200).json({data:uProfile});
});

router.put("/editProfile/:userId/:lang",auth, async(req, res) => {
  let userProfil=await user_profile.findOne({ where: {user_id: req.params.userId}});
  if (userProfil==null) return res.status(404).json({ message: await translate("INFORMATIONNOTFOUND", req.params.lang) });
   
  await user_profile.update(
    {
      birthdate:new Date(req.body.birthdate),
      height:req.body.height,
      weight:req.body.weight,
      avg_sleeping_hour:req.body.sleepingHour,
      blood_type:req.body.bloodType,
      locked:req.body.isLock,
      avg_cycle_length:req.body.cycleLength,
      avg_period_length:req.body.periodLength,
      pms_length:req.body.pmsLength,
      pregnant:req.body.pregnant,
      pregnancy_try:req.body.pregnancyTry,
      last_period_date:new Date(req.body.lastPeriodDate),
      ovulation_prediction:req.body.ovulationPred,
      period_prediction:req.body.periodPred,
      red_days:req.body.redDays
      
    },{
    where: {
      user_id: req.params.userId
    }
  });
  res.status(200).json({ message: await translate("SUCCESSFUL", "fa") });
});

router.put("/editPeriodInfo/:userId/:lang",auth, async(req, res) => {
  let userProfil=await user_profile.findOne({ where: {user_id: req.params.userId}});
  if (userProfil==null) return res.status(404).json({ message: await translate("INFORMATIONNOTFOUND", req.params.lang) });
   
  await user_profile.update(
    {
      avg_cycle_length:req.body.cycleLength,
      avg_period_length:req.body.periodLength,
      pms_length:req.body.pmsLength,
      pregnant:req.body.pregnant,
      pregnancy_try:req.body.pregnancyTry,
      last_period_date:new Date(req.body.lastPeriodDate),
      ovulation_prediction:req.body.ovulationPred,
      period_prediction:req.body.periodPred,
      red_days:req.body.redDays
    },{
    where: {
      user_id: req.params.userId
    }
  });

  res.status(200).json({ message: await translate("SUCCESSFUL", "fa") });
});

router.put("/editGeneralInfo/:userId/:lang",auth, async(req, res) => {
  let userProfil=await user_profile.findOne({ where: {user_id: req.params.userId}});
  if (userProfil==null) return res.status(404).json({ message: await translate("INFORMATIONNOTFOUND", req.params.lang) });
   
  await user_profile.update(
    {
      birthdate:new Date(req.body.birthdate),
      height:req.body.height,
      weight:req.body.weight,
      avg_sleeping_hour:req.body.sleepingHour,
      blood_type:req.body.bloodType,
      locked:req.body.isLock
    },{
    where: {
      user_id: req.params.userId
    }
  });
  res.status(200).json({ message: await translate("SUCCESSFUL", "fa") });
});

router.delete("/deleteProfile/:userId/:lang",auth, async(req, res) => {
  const uProfile = await user_profile.findOne({
    where: {
      user_id: req.params.userId,
    },
  });
  if(uProfile==null) return res.status(404).json({ message: await translate("INFORMATIONNOTFOUND", req.params.lang) });
  
  await user_profile.destroy({
    where: {
      user_id: req.params.userId,
    }
  });

  res.status(200).json({ message: await translate("SUCCESSFUL", "fa") });
});

router.post("/addProfile/:lang",auth, async(req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr==null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
   
  let userProf=await user_profile.create(
    {
      birthdate:new Date(req.body.birthdate),
      height:req.body.height,
      weight:req.body.weight,
      avg_sleeping_hour:req.body.sleepingHour,
      blood_type:req.body.bloodType,
      locked:req.body.isLock,
      avg_cycle_length:req.body.cycleLength,
      avg_period_length:req.body.periodLength,
      pms_length:req.body.pmsLength,
      pregnant:req.body.pregnant,
      pregnancy_try:req.body.pregnancyTry,
      last_period_date:new Date(body.lastPeriodDate)
    
  });
  userProf.setUser(usr);
  res.status(200).json({ message: await translate("SUCCESSFUL", "fa") });
});

router.get("/pregnancyMode/:userId/:lang",auth,async(req,res)=>{
  const uPregnantProfile = await user_profile.findOne({
    attributes:['pregnant'],
    where: {
      user_id: req.params.userId,
    },
  });
  if(uPregnantProfile==null) return res.status(404).json({ message: await translate("INFORMATIONNOTFOUND", req.params.lang) });
  return res.status(200).json({data:uPregnantProfile});
});

router.get("/getUserStatus/:userId/:lang",auth,async(req,res)=>{
  const uPregnantProfile = await user_profile.findOne({
    attributes:['pregnant','pregnancy_try'],
    where: {
      user_id: req.params.userId,
    },
  });
  if(uPregnantProfile==null) return res.status(404).json({ message: await translate("INFORMATIONNOTFOUND", req.params.lang) });
  res.status(200).json({data:uPregnantProfile});
});

router.put("/updateUserStatus/:userId/:lang",auth,async(req,res)=>{
  const uPregnantProfile = await  user_profile.findOne({
    where: {
      user_id: req.params.userId,
    },
  });
  if (uPregnantProfile==null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  console.log("pregnant",req.body.pregnant);
  if((req.body.pregnant==0||req.body.pregnant==1)&&(req.body.pregnancyTry==0||req.body.pregnancyTry==1)){ 
    await user_profile.update({pregnant:req.body.pregnant,pregnancy_try:req.body.pregnancyTry},
      { where: {
          user_id: req.params.userId,
        },
      }
    );
     return res.status(200).json({ message: await translate("SUCCESSFUL", req.params.lang)});
  }
  else return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
});

router.get("/lockStatus/:userId/:lang",auth,async(req,res)=>{
  const useLock = await user_profile.findOne({
    attributes:['locked'],
    where: {
      user_id: req.params.userId,
    },
  });
  if(useLock==null) return res.status(404).json({ message: await translate("INFORMATIONNOTFOUND", req.params.lang) });
  return res.status(200).json({data:useLock});
});

router.put("/setLock/:userId/:lang",auth,async(req,res)=>{
  if(req.body.isLock==0||req.body.isLock==1){
    const useLock = await user_profile.update({locked:req.body.isLock},
      { where: {
        user_id: req.params.userId,
      },
    });
    if(useLock==null){
      return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
    }
    return res.status(200).json({ message: await translate("SUCCESSFUL", req.params.lang)});
  }
  else return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
});

module.exports = router;