const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const auth = require("../middleware/auth");
const translate = require("../config/translate");
const { user, user_tracking_option, user_profile, health_tracking_option } = require("../models");
const checkDateWithDateOnly = require("../middleware/checkDateWithDateOnly");
const AsyncLock = require('async-lock');

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

router.get("/getLastPeriodDate/:userId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  let usrID;
  if (usr.partner_id != null) {
    usrID = usr.partner_id
  }
  else {
    usrID = usr.user_id
  }
  const uPeriod = await user_profile.findOne({
    attributes: ['last_period_date'],
    where: {
      user_id: usrID,
    },
  });
  if (uPeriod == null) return res.status(404).json({ message: await translate("INFORMATIONNOTFOUND", req.params.lang) });
  res.status(200).json({ data: uPeriod });
});

router.put("/editLastPeriodDate/:userId/:lastPeriodDate/:lang", auth, async (req, res) => {

  let uPeriod = await user_profile.findOne({
    where: {
      user_id: req.params.userId,
    },
  });

  if (uPeriod == null) return res.status(404).json({ message: await translate("INFORMATIONNOTFOUND", req.params.lang) });
  if (!checkDateWithDateOnly(req.params.lastPeriodDate)) {
    return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  }

  await user_profile.update(
    {
      last_period_date: new Date(req.params.lastPeriodDate)
    }, {
    where: {
      user_id: req.params.userId
    }
  });

  return res.status(200).json({ message: await translate("SUCCESSFUL", "fa") });
});

router.get("/getUserAllPeriodDays/:userId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  let usrID;
  if (usr.partner_id != null) {
    usrID = usr.partner_id
  }
  else {
    usrID = usr.user_id
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
  res.status(200).json({ data: uPeriodDate });
});

router.put("/setBleedingDays/:userId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });

  let deleted;
  //  deleleDate for delete user date
  req.body.deleteDate.forEach(async element => {
    console.log(element);
    deleted = await user_tracking_option.destroy({
      where: {
        user_id: req.params.userId,
        date: new Date(element),
        tracking_option_id: { [Op.or]: [1, 2, 3, 4] }
      }
    })
  });

  // add user period Date 
  const trackingOption = await health_tracking_option.findByPk(3);
  req.body.addDate.forEach(async element2 => {
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
    await u.setUser(usr);
    await u.setHealth_tracking_option(trackingOption);
  });
  return res.status(200).json({ message: await translate("SUCCESSFUL", req.params.lang) });
});

module.exports = router;
