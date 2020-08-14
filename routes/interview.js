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
  
  const u_profile = await user_profile.create({
    birthdate:new Date(req.body.birthdate),
    avg_cycle_length:req.body.avg_cycle_length,
    avg_period_length:req.body.avg_period_length,
    avg_sleeping_hour:req.body.avg_sleeping_hour,
    pms_length:req.body.pms_length,
    height:req.body.height,
    weight:req.body.weight,
    pregnant:req.body.pregnant,
    pregnancy_try:req.body.pregnancy_try,
    use_lock:req.body.use_lock
  });
  await u_profile.setUser(usr);
  res.status(200).json({data:{id:u_profile.id}});
});

module.exports = router;
