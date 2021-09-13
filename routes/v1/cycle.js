const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const auth = require("../../middleware/auth");
const translate = require("../../config/translate");
const { user, user_tracking_option, user_profile, health_tracking_option } = require("../../models");
const checkDateWithDateOnly = require("../../middleware/checkDateWithDateOnly");

router.get("/lastPeriodDate/:userId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  let usrID;
  if (usr.partner_id != null) {
    usrID = usr.partner_id
  }
  else {
    usrID = usr.id
  }
  const uPeriod = await user_profile.findOne({
    attributes: ['last_period_date'],
    where: {
      user_id: usrID,
    },
  });
  if (uPeriod == null) return res
    .status(404)
    .json({
      status: "error",
      data: {},
      message: await translate("UERENOTFOUND", req.params.lang)
    });
  return res
    .status(200)
    .json({
      status: "success",
      data: { uPeriod },
      message: await translate("SUCCESSFUL", req.params.lang)
    });
});

router.put("/lastPeriodDate/:userId/:lastPeriodDate/:lang", auth, async (req, res) => {

  let uPeriod = await user_profile.findOne({
    where: {
      user_id: req.params.userId,
    },
  });

  if (uPeriod == null) return res
    .status(404)
    .json({
      status: "error",
      data: {},
      message: await translate("UERENOTFOUND", req.params.lang)
    });
  if (!checkDateWithDateOnly(req.params.lastPeriodDate)) {
    return res
      .status(400)
      .json({
        status: "error",
        data: {},
        message: await translate("INVALIDENTRY", req.params.lang)
      });
  }

  await user_profile.update(
    {
      last_period_date: new Date(req.params.lastPeriodDate)
    }, {
    where: {
      user_id: req.params.userId
    }
  });

  return res
    .status(200)
    .json({
      status: "success",
      data: {},
      message: await translate("SUCCESSFUL", req.params.lang)
    });
});

router.get("/bleedingDays/:userId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  let usrID;
  if (usr.partner_id != null) {
    usrID = usr.partner_id
  }
  else {
    usrID = usr.id
  }
  let uPeriodDate = await user_tracking_option.findAll({
    attributes: ['date', 'tracking_option_id'],
    where: {
      user_id: usrID,
      tracking_option_id: {
        [Op.or]: [1, 2, 3, 4]
      }
    }
  })
  return res
    .status(200)
    .json({
      status: "success",
      data: { uPeriodDate },
      message: await translate("SUCCESSFUL", req.params.lang)
    });
});

router.put("/bleedingDays/:userId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  let deleted;
  //  deleleDate for delete user date
  for (const element of req.body.deleteDate) {
    deleted = await user_tracking_option.destroy({
      where: {
        user_id: req.params.userId,
        date: new Date(element),
        tracking_option_id: { [Op.or]: [1, 2, 3, 4] }
      }
    })
  };

  // add user period Date 
  const trackingOption = await health_tracking_option.findByPk(3);
  for (const element2 of req.body.addDate) {
    let dest = await user_tracking_option.destroy({
      where: {
        user_id: req.params.userId,
        date: new Date(element2),
        tracking_option_id: { [Op.or]: [1, 2, 3, 4] }
      }
    })

    let u = await user_tracking_option.create({
      date: new Date(element2),
    });
    await u.setHealth_tracking_option(trackingOption)
      .then(u.setUser(usr).catch(async function (err) {
        await handleError(u, err);
      }))
  };
  return res
    .status(200)
    .json({
      status: "success",
      data: {},
      message: await translate("SUCCESSFUL", req.params.lang)
    });
});
module.exports = router;
