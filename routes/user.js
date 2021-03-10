const express = require("express");
const { user, user_log, user_profile, user_tracking_option, pregnancy } = require("../models");
const router = express.Router();
const translate = require("../config/translate");
const auth = require("../middleware/auth");


router.post("/partnerVerificationCode/:userId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null || usr == "" || req.body.partnerCode == null || req.body.partnerCode == "") {
    return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  }

  let str = req.body.partnerCode;
  //let code = str.substring(3, str.length);
  let userId = parseInt(str.substring(4, str.length - 5)) / 3;
  console.log("ussssrId", userId);
  let checkSum = parseInt(str.substring(str.length - 2, str.length));

  if ((userId.toString() + checkSum.toString()) % 97 != 1 || userId == req.params.userId) {
    return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  }

  let usrPartner = await user.findByPk(userId);
  console.log("partner", usrPartner);
  if (usrPartner == null || usrPartner == "") return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  await usr.setUser(usrPartner);

  return res.status(200).json({ message: await translate("SUCCESSFUL", "fa") });
})
router.get("/partnerVerificationCode/:userId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  console.log("useeeer", usr == null);
  if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  let checkSum = (98 - ((usr.id * 100) % 97)) % 97;

  console.log("checksum", checkSum);
  let partnerCode = "PRT-" + (usr.id * 3) + (checkSum + 3) + "-" + checkSum;
  return res.status(200).json({ data: { partnerCode: partnerCode } });
})
router.put("/versionType/:userId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null || req.body.type == "" || req.body.type == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  if (usr.version_type != "Teenager" || req.body.type != "Main") return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  await usr.update({ version_type: req.body.type });
  return res
    .status(200)
    .json({ message: await translate("SUCCESSFUL", req.params.lang) });
})
router.post("/versionType/:userId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null || req.body.type == "" || req.body.type == null) {
    return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  }
  if (req.body.type != "Main" && req.body.type != "Partner" && req.body.type != "Teenager") {
    return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  }
  await usr.update({ version_type: req.body.type });
  return res
    .status(200)
    .json({ message: await translate("SUCCESSFUL", req.params.lang) });
})
router.get("/versionType/:userId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  return res
    .status(200)
    .json({ data: { type: usr.version_type } });
})

router.delete("/deleteUserInfo/:userId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  await user_tracking_option.destroy({
    where: {
      user_id: req.params.userId,
    }
  })
  await pregnancy.destroy({
    where: {
      user_id: req.params.userId,
    }
  })

  await user_profile.update({
    birthdate: null,
    height: null,
    weight: null,
    avg_sleeping_hour: null,
    blood_type: null,
    locked: null,
    avg_cycle_length: 28,
    avg_period_length: 7,
    pms_length: null,
    pregnant: 0,
    pregnancy_try: 0,
    last_period_date: null,
    ovulation_prediction: null,
    period_prediction: null,
    red_days: null
  }, {
    where: {
      user_id: req.params.userId
    }
  })
  return res.status(200).json({ message: await translate("SUCCESSFUL", req.params.lang) });
})
router.delete("/v1/user/:userId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });

  await user_tracking_option.destroy({
    where: {
      user_id: req.params.userId,
    }
  })
  await pregnancy.destroy({
    where: {
      user_id: req.params.userId,
    }
  })

  await user_profile.destroy({
    where: {
      user_id: req.params.userId
    }
  })

  await user_log.destroy({
    where: {
      user_id: req.params.userId
    }
  })
  let list = await user.findAll(
    {
      where: {
        partner_id: req.params.userId
      }
    }
  );
    //console.log(list);
  for (let i of list) {
    let pUser=await user.findByPk(i.id);
    console.log(pUser.getUser())
    await i.setUser(null);
  }

  await usr.destroy();

  return res.status(200).json({ message: await translate("SUCCESSFUL", req.params.lang) });
})


module.exports = router;
