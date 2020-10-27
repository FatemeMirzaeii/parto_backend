const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const auth = require("../middleware/auth");
const translate = require("../config/translate");
const { user, user_tracking_option ,user_profile,health_tracking_option} = require("../models");
const checkDateWithDateOnly = require("../middleware/checkDateWithDateOnly");
const AsyncLock = require('async-lock');

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}   

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
  
  let uPeriod = await user_profile.findOne({
    where: {
      user_id: req.params.userId,
    },
  });
  
  if(uPeriod==null) return res.status(404).json({ message: await translate("INFORMATIONNOTFOUND", req.params.lang) });
  if(!checkDateWithDateOnly(req.params.lastPeriodDate)){
    return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  }

  await user_profile.update(
    {
     last_period_date:new Date(req.params.lastPeriodDate)
    },{
    where: {
      user_id: req.params.userId
    }
  });

  return res.status(200).json({ message: await translate("SUCCESSFUL", "fa") });
});

router.get("/getUserAllPeriodDays/:userId/:lang",auth, async(req, res) => {
  //console.log("uPeriod", req.params.userId);
  
  let uPeriodDate=await user_tracking_option.findAll({
    attributes: ['date'],
    where:{
      user_id:req.params.userId ,
      tracking_option_id : {
        [Op.or]: [1, 2,3,4]
      }
    }
  })
  //console.log("dateP",uPeriodDate);
  if(await uPeriodDate==null||await uPeriodDate.length==0) {
    return res.status(404).json({ message: await translate("INFORMATIONNOTFOUND", req.params.lang) });
  }
  let dateList=[];
  for (let i=0 ; i<uPeriodDate.length ; i++) {
    dateList.push(uPeriodDate[i].date);
  };
  res.status(200).json({data:{date:dateList}});
});

router.put("/setBleedingDays/:userId/:lang",auth, async(req, res) => {
  let flag=true;
  let deleted;
 //  deleleDate for delete user date
  req.body.deleteDate.forEach(async element => { 
    console.log(element);
    deleted=await user_tracking_option.destroy({
      where: {
        user_id:req.params.userId,
        date:new Date(element),
        tracking_option_id:{[Op.or]: [1,2,3,4]}
      }
    })
  }); 
  const usr=await user.findByPk(req.params.userId);
  const trackingOption=await health_tracking_option.findByPk(3);
  
    const lock = new AsyncLock();
    lock.acquire(usr,async function(done) {
      for(let i=0;i<req.body.addDate.length ;i++){
        if( checkDateWithDateOnly(req.body.addDate[i]) && flag==true){
          let dest= await user_tracking_option.destroy({
            where: {
              user_id:req.params.userId,
              date:req.body.addDate[i],
              tracking_option_id:{[Op.or]: [1,2,3,4]}
            }
          })
          await user_tracking_option.create({
                    date:req.body.addDate[i]
          }).then(function(addUser){
            return addUser.setUser(usr);
          }).then(function(addOption){
            return addOption.setHealth_tracking_option(trackingOption);
          })
             
        }
      }
      done();
    }, function(err, ret) {
      console.log(" Freeing lock")
  }, {});
    for(let j=0;j<req.body.addDate.length ;j++){
      let find= await user_tracking_option.findAll({
        where: {
          user_id:req.params.userId,
          date:req.body.addDate[j],
          tracking_option_id:{[Op.or]: [1,2,3,4]}
        }
      })
      if(await find.length>1){
        for(let k=0;k<find.length-1 ;k++){
          await user_tracking_option.destroy({
            where: {
              user_id:req.params.userId,
              date:req.body.addDate[k],
              tracking_option_id:{[Op.or]: [1,2,3,4]}
            }
          })
        }
      }
    }
      
  //}
  if(flag==true){
    return res.status(200).json({ message: await translate("SUCCESSFUL", req.params.lang) });
  }
});

module.exports = router;
