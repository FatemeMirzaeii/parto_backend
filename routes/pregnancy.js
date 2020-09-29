const express = require("express");
const {user, pregnancy , user_profile} = require("../models");
const auth = require("../middleware/auth");
const translate = require("../config/translate");
const router = express();
const checkDateWithDateOnly=require("../middleware/checkDateWithDateOnly");

router.post("/savePregnancyData/:userId/:lang", auth, async(req, res) => {
  const uPregnantProfile = await user_profile.findOne({
    attributes:['pregnant'],
    where: {
      user_id: req.params.userId,
    },
  });
  if(uPregnantProfile==null){
    return res.status(404).json({ message: await translate("INFORMATIONNOTFOUND", req.params.lang) });
  }
  if(uPregnantProfile.pregnant==0){
     return res.status(409).json({ message: await translate("CONTRADICTION", req.params.lang) });
  }if(checkDateWithDateOnly(req.body.conceptionDate)==false){
    return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  }
  const uExist = await pregnancy.findOne({
    where: {
      user_id: req.params.userId,
    },
  });
  if(uExist==null) {
    let uPregnant=await pregnancy.create({
      due_date:req.body.dueDate,
      conception_date:req.body.conceptionDate,
      abortion:req.body.abortion
    })
    let usr = await user.findOne({
      where: {
        id: req.params.userId,
      },
    });
    await uPregnant.setUser(usr);
  }
  else{
    await pregnancy.update({
      due_date:req.body.dueDate,
      conception_date:req.body.conceptionDate,
      abortion:req.body.abortion
    },{
      where:{
        user_id:req.params.userId,
      }
    })
  }

  return res.status(200).json({ message: await translate("SUCCESSFUL", "fa") });
});

router.get("/getPregnancyData/:userId/:lang", auth, async(req, res) => {
  const userPregnant = await pregnancy.findOne({
    attributes:['due_date','conception_date','abortion'],
    where: {
      user_id: req.params.userId,
    },
  });
  if(userPregnant==null){
    return res.status(404).json({ message: await translate("INFORMATIONNOTFOUND", req.params.lang) });
  }
  return res.status(200).json({data:userPregnant});
});

router.post("/setPregnancyEnd/:userId/:dueDate/:lang", auth, async(req, res) => {
  const uPregnantProfile = await user_profile.findOne({
    attributes:['pregnant'],
    where: {
      user_id: req.params.userId,
    },
  });
  if(uPregnantProfile==null){
    return res.status(404).json({ message: await translate("INFORMATIONNOTFOUND", req.params.lang) });
  }
  if(uPregnantProfile.pregnant==0){
     return res.status(409).json({ message: await translate("CONTRADICTION", req.params.lang) });
  }
  const uExist = await pregnancy.findOne({
    where: {
      user_id: req.params.userId,
    },
  });
  if(uExist==null) {
    let uPregnant=await pregnancy.create({
      due_date:req.params.dueDate
    })
    let usr = await user.findByPk(req.params.userId);
    uPregnant.setUser(usr);
  }
  else{
    await pregnancy.update({
      due_date:req.params.dueDate
    },{
      where:{
        user_id:req.params.userId,
      }
    })
  }

  return res.status(200).json({ message: await translate("SUCCESSFUL", "fa") });
});



module.exports = router;
