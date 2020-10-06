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
  // addDate for add date user if day aren't in the db
  console.log("del",await deleted);
  //if(await deleted>=0){
    console.log("length",req.body.addDate.length);
    const usr=await user.findByPk(req.params.userId);
    const trackingOption=await health_tracking_option.findByPk(3);
    const lock = new AsyncLock();
    for(let i=0;i<req.body.addDate.length ;i++){
      console.log("i",req.body.addDate[i]);
      if( checkDateWithDateOnly(req.body.addDate[i]) && flag==true){
        lock.acquire(usr,async function(done) {
          let addDate;
          let dest= await user_tracking_option.destroy({
            where: {
              user_id:req.params.userId,
              date:new Date(req.body.addDate[i]),
              tracking_option_id:{[Op.or]: [1,2,3,4]}
            }
          })
          addDate=await user_tracking_option.create({
                    date:new Date(req.body.addDate[i])
          })
          await addDate.setUser(usr);
          await addDate.setHealth_tracking_option(trackingOption);
          done();
            
        }, function(err, ret) {
            console.log(" Freeing lock")
        }, {});
        // let addDate;
        // let dest= await user_tracking_option.destroy({
        //   where: {
        //     user_id:req.params.userId,
        //     date:new Date(req.body.addDate[i]),
        //     tracking_option_id:{[Op.or]: [1,2,3,4]}
        //   }
        // }).then(
        //   addDate=await user_tracking_option.create({
        //             date:new Date(req.body.addDate[i])
        //   })
        //   ).then(addDate.setUser(usr)).then(addDate.setHealth_tracking_option(trackingOption));
          
         
        // console.log("des",dest);
        // let addDate;
        // if(await dest>=0){
        //   addDate=await user_tracking_option.create({
        //         date:new Date(req.body.addDate[i])
        //   }).then(addDate.setUser(usr)).then(addDate.setHealth_tracking_option(trackingOption));
        //   // await addDate.setUser(usr);
        //   // await addDate.setHealth_tracking_option(trackingOption);
        // }
        // console.log("add",addDate);
        // await sleep(1000).then(flag=true);
        
      }
    }
      
  //}
  if(flag==true){
    return res.status(200).json({ message: await translate("SUCCESSFUL", req.params.lang) });
  }
});

module.exports = router;
