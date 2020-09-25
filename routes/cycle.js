const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const auth = require("../middleware/auth");
const translate = require("../config/translate");
const { user, user_tracking_option ,user_profile} = require("../models");
const checkDateWithDateOnly = require("../middleware/checkDateWithDateOnly");

router.get("/getLastPeriodDate/:userId/:lang",auth, async(req, res) => {
  
  const uPeriod = await user_profile.findOne({
    attributes: ['last_period_date'],
    where: {
      user_id: req.params.userId,
    },
  });
  if(uPeriod==null) return res.status(404).json({ message: await translate("INFORMATIONNOTFOUND", req.params.lang) });
  res.status(200).json({data:uPeriod});
});

router.put("/editLastPeriodDate/:userId/:lastPeriodDate/:lang",auth, async(req, res) => {
  let usr = await user.findOne({
    where: {
      id: req.params.userId,
    },
  });
  if (usr==null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
   
  await user_profile.update(
    {
     last_period_date:req.params.lastPeriodDate
    },{
    where: {
      user_id: req.params.userId
    }
  });

  res.status(200).json({ message: await translate("SUCCESSFUL", "fa") });
});

router.get("/getUserAllPeriodDays/:userId/:lang",auth, async(req, res) => {
  let uPeriodDate=await user_tracking_option.findAll({
    attributes: ['date'],
    where:{
      user_id: req.params.userId,
      tracking_option_id: {
        [Op.or]: [1, 2,3,4]
      }
    }
  })
  console.log("date")
  if(uPeriodDate==null||uPeriodDate.length==0) {
    return res.status(404).json({ message: await translate("INFORMATIONNOTFOUND", req.params.lang) });
  }
  let dateList=[];
  for (let i=0 ; i<uPeriodDate.length ; i++) {
    dateList.push(uPeriodDate[i].date);
  };
  res.status(200).json({data:{date:dateList}});
});

router.put("/setBleedingDays/:userId/:lang",auth, async(req, res) => {
  if(req.body.deleteDate.length>0){
    req.body.deleteDate.forEach(async element => {
      await user_tracking_option.destroy({
        where:{
          user_id: req.params.userId,
          date: element,
          tracking_option_id:{
            [Op.or]: [1,2,3,4]
          }
        }
      })
    });
  }
  //check addDate wasn't in db then add
  if(req.body.addDate.length>0){
    
    req.body.addDate.forEach(async element2 => {
      if(checkDateWithDateOnly(element2)){
        const exist=await user_tracking_option.findOne({
          where:{
            user_id: req.params.userId,
            date: element2,
            tracking_option_id:{
              [Op.or]: [1,2,3,4]
            }
          }
        })
        if(exist==null){
          const usr = await user.findOne({
            where: {
              id: req.params.userId,
            },
          });
          const addOption=await user_tracking_option.create({
            date: element2,
            tracking_option_id:3
          })
          await addOption.setUser(usr);
        }
      }
    });
  }
  return res.status(200).json({ message: await translate("SUCCESSFUL",  req.params.lang) });
});

module.exports = router;
