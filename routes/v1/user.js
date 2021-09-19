const express = require("express");
const { user, user_log, user_profile, user_tracking_option, pregnancy, user_answer_survey, note, user_tracking_category } = require("../../models");
const router = express.Router();
const translate = require("../../config/translate");
const auth = require("../../middleware/auth");

function parseCode(partnerCode) {
  let splitStr = partnerCode.split("-");
  let checkSum = (parseInt(splitStr[2], 10) - 9) / 2;
  let partnerId = (parseInt(splitStr[1], 10) - (checkSum + 3)) / 3;
  return { "partnerId": partnerId, "checkSum": checkSum };

}
router.post("/partnerVerificationCode/:userId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);

  if (req.body.partnerCode == null || req.body.partnerCode == "") {
    return res
      .status(400)
      .json({
        status: "error",
        data: null,
        message: await translate("INVALIDENTRY", req.params.lang)
      });
  }
  // check
  let parse = parseCode(req.body.partnerCode);
  let partnerId = parse.partnerId;
  let checksum = parse.checkSum;
  if (partnerId.toString()[0] != checksum || partnerId == usr.id) {
    return res
      .status(400)
      .json({
        status: "error",
        data: null,
        message: await translate("INVALIDENTRY", req.params.lang)
      });
  }
  let usrPartner = await user.findByPk(partnerId);
  if (usrPartner == null) {
    return res
      .status(404)
      .json({
        status: "error",
        data: null,
        message: await translate("PARTNERNOTFOUND", req.params.lang)
      });
  }
  // set partner
  await usr.setUser(usrPartner);
  return res
    .status(200)
    .json({
      status: "success",
      data: null,
      message: await translate("SUCCESSFUL", req.params.lang)
    });
})
router.get("/partnerVerificationCode/:userId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  let checkSum = parseInt(usr.id.toString()[0], 10);
  let partnerCode = "PRT-" + ((usr.id * 3) + (checkSum + 3)).toString() + "-" + ((checkSum * 2) + 9).toString();
  return res
    .status(200)
    .json({
      status: "success",
      data: { partnerCode: partnerCode },
      message: await translate("SUCCESSFUL", req.params.lang)
    });
})
router.put("/versionType/:userId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (req.body.type == "" || req.body.type == null) {
    return res
      .status(400)
      .json({
        status: "error",
        data: null,
        message: await translate("INVALIDENTRY", req.params.lang)
      });
  }
  if (usr.version_type != "Teenager" || req.body.type != "Main") {
    return res
      .status(400)
      .json({
        status: "error",
        data: null,
        message: await translate("INVALIDENTRY", req.params.lang)
      });
  }
  await usr.update({ version_type: req.body.type });
  return res
    .status(200)
    .json({
      status: "success",
      data: null,
      message: await translate("SUCCESSFUL", req.params.lang)
    });
})
router.post("/versionType/:userId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (req.body.type == "" || req.body.type == null ||
    (req.body.type != "Main" && req.body.type != "Partner" && req.body.type != "Teenager")) {
    return res
      .status(400)
      .json({
        status: "error",
        data: null,
        message: await translate("INVALIDENTRY", req.params.lang)
      });
  }

  await usr.update({ version_type: req.body.type });
  return res
    .status(200)
    .json({
      status: "success",
      data: null,
      message: await translate("SUCCESSFUL", req.params.lang)
    });
})
router.get("/versionType/:userId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  return res
    .status(200)
    .json({
      status: "success",
      data: { type: usr.version_type },
      message: await translate("SUCCESSFUL", req.params.lang)
    });

})
router.put("/:userId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
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
  return res
    .status(200)
    .json({
      status: "success",
      data: null,
      message: await translate("SUCCESSFUL", req.params.lang)
    });
})
router.delete("/:userId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);

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

  await user_answer_survey.destroy({
    where: {
      userId: req.params.userId
    }
  })

  await user_log.destroy({
    where: {
      user_id: req.params.userId
    }
  })

  await usr.destroy();

  return res
    .status(200)
    .json({
      status: "success",
      data: null,
      message: await translate("SUCCESSFUL", req.params.lang)
    });
})


module.exports = router;
